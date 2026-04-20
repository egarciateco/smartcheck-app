const API_URL = 'https://smartcheck-api.onrender.com';

export const register = async (email, password, nombre, telefono = null, es_anonimo = true) => {
  const response = await fetch(`${API_URL}/api/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, nombre, telefono, es_anonimo })
  });
  return await response.json();
};

export const compararPrecios = async (usuario_id, productos, localidad, provincia) => {
  const response = await fetch(`${API_URL}/api/comparar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario_id, productos, localidad, provincia })
  });
  return await response.json();
};

export const obtenerEstadoUsuario = async (usuario_id) => {
  const response = await fetch(`${API_URL}/api/usuario/${usuario_id}/estado`);
  return await response.json();
};

export const activarSuscripcion = async (usuario_id, plan) => {
  const response = await fetch(`${API_URL}/api/suscripcion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario_id, plan })
  });
  return await response.json();
};

export const listarComercios = async (provincia = null, localidad = null) => {
  let url = `${API_URL}/api/comercios`;
  if (provincia) url += `?provincia=${provincia}`;
  if (localidad) url += `${provincia ? '&' : '?'}localidad=${localidad}`;
  
  const response = await fetch(url);
  return await response.json();
};

export const listarCadenas = async () => {
  const response = await fetch(`${API_URL}/api/comercios/cadenas`);
  return await response.json();
};

export const listarProductos = async (categoria = null) => {
  let url = `${API_URL}/api/productos`;
  if (categoria) url += `?categoria=${categoria}`;
  
  const response = await fetch(url);
  return await response.json();
};
