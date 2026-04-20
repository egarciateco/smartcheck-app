#!/usr/bin/env python3
"""
Script para cargar todos los comercios desde los archivos TXT a JSON
"""

import json
import csv
from typing import List, Dict
import os

def normalizar_cadena(nombre: str) -> str:
    """Normaliza el nombre del comercio a una cadena conocida"""
    nombre_upper = nombre.upper()
    
    cadenas = {
        'CARREFOUR': 'CARREFOUR',
        'COTO': 'COTO',
        'JUMBO': 'JUMBO',
        'VEA': 'VEA',
        'DISCO': 'DISCO',
        'DIA': 'DIA',
        'CHANGOMAS': 'CHANGOMAS',
        'LA ANONIMA': 'LA_ANONIMA',
        'WALMART': 'WALMART',
        'MAKRO': 'MAKRO',
        'SUPERMERCADOS CORDIEZ': 'CORDIEZ',
        'EL TUNEL': 'EL_TUNEL',
        'MICROPACK': 'MICROPACK',
        'MICRO GO': 'MICRO_GO',
        'BLOW MAX': 'BLOW_MAX',
        'SUPER A': 'SUPER_A',
        'KILBEL': 'KILBEL',
        'CALCHAQUI': 'CALCHAQUI',
        'DELFIN LAGORIA': 'DELFIN_LAGORIA',
        'DELFIN': 'DELFIN',
        'AUTOSERVICIO CAPO': 'CAPO',
        'AUTOSERVICIO SAN RAMON': 'SAN_RAMON',
        'ARCOIRIS': 'ARCOIRIS',
        'LA ROTONDA LACTEOS': 'LA_ROTONDA',
        'SUPER NATALY': 'SUPER_NATALY',
        'ALMACEN SAN JOSE': 'SAN_JOSE',
        'AMERICA MAYORISTA': 'AMERICA',
        'CABRAL MAYORISTA': 'CABRAL',
        'ALVEAR SUPERMERCADOS': 'ALVEAR',
        'SUPERMERCADOS TOP': 'TOP',
        'SUPERMAMI': 'SUPERMAMI',
        'TADICOR': 'TADICOR',
        'SUPERCOOP': 'SUPERCOOP',
        'COOPERATIVA OBRERA': 'COOPERATIVA_OBRERA',
        'LA GALLEGA': 'LA_GALLEGA',
        'LA REINA': 'LA_REINA',
        'CALIFORNIA': 'CALIFORNIA',
        'DAMESCO': 'DAMESCO',
        'EL MILAGRO': 'EL_MILAGRO',
        'OSCAR DAVID': 'OSCAR_DAVID',
        'MARIANO MAX': 'MARIANO_MAX',
        'MULTIPACK': 'MULTIPACK',
        'TODO': 'TODO',
        'YAGUAR': 'YAGUAR',
        'SUPERMERCADOS TODO': 'TODO',
    }
    
    for clave, valor in cadenas.items():
        if clave in nombre_upper:
            return valor
    
    return 'INDEPENDIENTE'

def cargar_desde_txt(archivo_txt: str) -> List[Dict]:
    """Carga comercios desde un archivo TXT"""
    comercios = []
    
    with open(archivo_txt, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for i, linea in enumerate(lines):
        if i == 0:  # Saltar encabezado
            continue
            
        partes = linea.strip().split('\t')
        
        if len(partes) >= 4:
            provincia = partes[0].strip() if len(partes) > 0 else ''
            localidad = partes[1].strip() if len(partes) > 1 else ''
            direccion = partes[2].strip() if len(partes) > 2 else ''
            nombre = partes[3].strip() if len(partes) > 3 else ''
            
            if provincia and localidad and nombre:
                cadena = normalizar_cadena(nombre)
                
                comercio = {
                    "id": f"{cadena.lower()}_{len(comercios)+1:04d}",
                    "nombre": nombre,
                    "cadena": cadena,
                    "direccion": direccion,
                    "localidad": localidad,
                    "provincia": provincia,
                    "codigo_postal": "",
                    "telefono": "",
                    "email": "",
                    "horario": "",
                    "latitud": None,
                    "longitud": None,
                    "activo": True
                }
                
                comercios.append(comercio)
    
    return comercios

def organizar_por_cadena(comercios: List[Dict]) -> Dict:
    """Organiza los comercios por cadena"""
    resultado = {
        "metadata": {
            "fecha_actualizacion": "2026-04-19",
            "total_cadenas": 0,
            "total_locales": len(comercios),
            "fuente": "FAECYS + Bases comerciales Argentina"
        },
        "cadenas": {}
    }
    
    cadenas_dict = {}
    
    for comercio in comercios:
        cadena = comercio["cadena"]
        
        if cadena not in cadenas_dict:
            cadenas_dict[cadena] = {
                "nombre_comercial": cadena.replace('_', ' ').title(),
                "tipo": "Supermercado",
                "sitio_web": "",
                "logo_url": "",
                "locales": []
            }
        
        cadenas_dict[cadena]["locales"].append(comercio)
    
    resultado["cadenas"] = cadenas_dict
    resultado["metadata"]["total_cadenas"] = len(cadenas_dict)
    
    return resultado

def main():
    # Archivos de entrada
    archivos = ['comercios_file1.txt', 'comercios_file2.txt']
    
    todos_los_comercios = []
    
    for archivo in archivos:
        if os.path.exists(archivo):
            print(f"Cargando {archivo}...")
            comercios = cargar_desde_txt(archivo)
            todos_los_comercios.extend(comercios)
            print(f"  → {len(comercios)} comercios cargados")
        else:
            print(f"⚠️  Archivo {archivo} no encontrado")
    
    # Organizar por cadena
    resultado = organizar_por_cadena(todos_los_comercios)
    
    # Guardar JSON
    with open('comercios.json', 'w', encoding='utf-8') as f:
        json.dump(resultado, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Total: {resultado['metadata']['total_locales']} comercios")
    print(f"✅ Cadenas: {resultado['metadata']['total_cadenas']}")
    print(f"✅ Archivo guardado: comercios.json")

if __name__ == '__main__':
    main()
