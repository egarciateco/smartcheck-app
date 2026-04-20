# ============================================
# ENDPOINTS DE ADMINISTRACIÓN DE COMERCIOS
# ============================================

@app.get("/api/admin/comercios")
async def admin_listar_comercios(
    cadena: Optional[str] = Query(None),
    provincia: Optional[str] = Query(None),
    localidad: Optional[str] = Query(None),
    limite: int = Query(100, le=1, le=1000)
):
    """Lista comercios para el admin (con filtro)"""
    data = load_json("comercios.json")
    
    todos = []
    for cadena_data in data.get("cadenas", {}).values():
        todos.extend(cadena_data.get("locales", []))
    
    # Filtrar
    if cadena:
        todos = [c for c in todos if c.get("cadena") == cadena]
    if provincia:
        todos = [c for c in todos if provincia.lower() in c.get("provincia", "").lower()]
    if localidad:
        todos = [c for c in todos if localidad.lower() in c.get("localidad", "").lower()]
    
    return {
        "comercios": todos[:limite],
        "total": len(todos),
        "mostrados": min(len(todos), limite)
    }

@app.get("/api/admin/comercios/export")
async def admin_exportar_comercios(formato: str = Query("json")):
    """Exporta todos los comercios (JSON o CSV)"""
    data = load_json("comercios.json")
    
    if formato.lower() == "csv":
        # Preparar CSV
        import io
        import csv
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Encabezados
        writer.writerow([
            "ID", "Nombre", "Cadena", "Dirección", "Localidad", 
            "Provincia", "Código Postal", "Teléfono", "Email", 
            "Horario", "Latitud", "Longitud", "Activo"
        ])
        
        # Datos
        for cadena_data in data.get("cadenas", {}).values():
            for local in cadena_data.get("locales", []):
                writer.writerow([
                    local.get("id", ""),
                    local.get("nombre", ""),
                    local.get("cadena", ""),
                    local.get("direccion", ""),
                    local.get("localidad", ""),
                    local.get("provincia", ""),
                    local.get("codigo_postal", ""),
                    local.get("telefono", ""),
                    local.get("email", ""),
                    local.get("horario", ""),
                    local.get("latitud", ""),
                    local.get("longitud", ""),
                    local.get("activo", "")
                ])
        
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=comercios.csv"}
        )
    else:
        # JSON
        return data

@app.post("/api/admin/comercios/actualizar")
async def admin_actualizar_comercio(
    id: str = Body(...),
    nombre: Optional[str] = Body(None),
    direccion: Optional[str] = Body(None),
    localidad: Optional[str] = Body(None),
    provincia: Optional[str] = Body(None),
    telefono: Optional[str] = Body(None),
    email: Optional[str] = Body(None),
    horario: Optional[str] = Body(None),
    activo: Optional[bool] = Body(None)
):
    """Actualiza un comercio específico"""
    data = load_json("comercios.json")
    
    encontrado = False
    for cadena_data in data.get("cadenas", {}).values():
        for local in cadena_data.get("locales", []):
            if local.get("id") == id:
                if nombre: local["nombre"] = nombre
                if direccion: local["direccion"] = direccion
                if localidad: local["localidad"] = localidad
                if provincia: local["provincia"] = provincia
                if telefono: local["telefono"] = telefono
                if email: local["email"] = email
                if horario: local["horario"] = horario
                if activo is not None: local["activo"] = activo
                encontrado = True
                break
        if encontrado:
            break
    
    if not encontrado:
        raise HTTPException(status_code=404, detail="Comercio no encontrado")
    
    # Guardar cambios
    save_json("comercios.json", data)
    
    return {"success": True, "message": "Comercio actualizado"}

@app.post("/api/admin/comercios/agregar")
async def admin_agregar_comercio(
    cadena: str = Body(...),
    nombre: str = Body(...),
    direccion: str = Body(...),
    localidad: str = Body(...),
    provincia: str = Body(...),
    codigo_postal: Optional[str] = Body(None),
    telefono: Optional[str] = Body(None),
    email: Optional[str] = Body(None),
    horario: Optional[str] = Body(None),
    latitud: Optional[float] = Body(None),
    longitud: Optional[float] = Body(None)
):
    """Agrega un nuevo comercio"""
    data = load_json("comercios.json")
    
    # Generar ID único
    id = f"{cadena.lower()}_{int(time.time())}"
    
    nuevo_comercio = {
        "id": id,
        "nombre": nombre,
        "cadena": cadena,
        "direccion": direccion,
        "localidad": localidad,
        "provincia": provincia,
        "codigo_postal": codigo_postal or "",
        "telefono": telefono or "",
        "email": email or "",
        "horario": horario or "",
        "latitud": latitud,
        "longitud": longitud,
        "activo": True
    }
    
    # Agregar a la cadena correspondiente
    if cadena in data.get("cadenas", {}):
        data["cadenas"][cadena]["locales"].append(nuevo_comercio)
    else:
        # Crear nueva cadena
        data["cadenas"][cadena] = {
            "nombre_comercial": cadena.replace('_', ' ').title(),
            "tipo": "Supermercado",
            "sitio_web": "",
            "logo_url": "",
            "locales": [nuevo_comercio]
        }
    
    # Guardar cambios
    save_json("comercios.json", data)
    
    return {"success": True, "message": "Comercio agregado", "id": id}

@app.delete("/api/admin/comercios/eliminar")
async def admin_eliminar_comercio(id: str = Body(...)):
    """Elimina un comercio (lo marca como inactivo)"""
    data = load_json("comercios.json")
    
    encontrado = False
    for cadena_data in data.get("cadenas", {}).values():
        for local in cadena_data.get("locales", []):
            if local.get("id") == id:
                local["activo"] = False
                encontrado = True
                break
        if encontrado:
            break
    
    if not encontrado:
        raise HTTPException(status_code=404, detail="Comercio no encontrado")
    
    # Guardar cambios
    save_json("comercios.json", data)
    
    return {"success": True, "message": "Comercio eliminado"}
