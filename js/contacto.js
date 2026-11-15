// contacto.js: validación del formulario de contacto

const formulario = document.getElementById('form-contacto');

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_TELEFONO = /^[0-9\s+()-]{8,20}$/;
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]{3,60}$/;

// Marca el campo en rojo, muestra el alert y le da foco
function marcarError(campo, mensaje) {
  const contenedor = campo.closest('.campo');
  if (contenedor) {
    contenedor.classList.add('campo--invalido');
  }
  alert('⚠️ ' + mensaje);
  campo.focus();
}

// Quita las marcas rojas
function limpiarErrores() {
  formulario.querySelectorAll('.campo--invalido').forEach(function (campo) {
    campo.classList.remove('campo--invalido');
  });
}

// Revisa los campos en orden y corta en el primer error
function validarFormulario() {
  const nombre = formulario.nombre;
  const email = formulario.email;
  const telefono = formulario.telefono;
  const edad = formulario.edad;
  const motivo = formulario.motivo;
  const respuesta = formulario.querySelector('input[name="respuesta"]:checked');
  const mensaje = formulario.mensaje;
  const terminos = formulario.terminos;

  // Nombre
  if (nombre.value.trim() === '') {
    marcarError(nombre, 'El nombre es obligatorio.');
    return false;
  }
  if (!REGEX_NOMBRE.test(nombre.value.trim())) {
    marcarError(nombre, 'El nombre debe tener al menos 3 letras y no puede llevar números.');
    return false;
  }

  // Email
  if (email.value.trim() === '') {
    marcarError(email, 'El email es obligatorio.');
    return false;
  }
  if (!REGEX_EMAIL.test(email.value.trim())) {
    marcarError(email, 'El email no tiene un formato válido (ej: nombre@mail.com).');
    return false;
  }

  // Edad
  const valorEdad = Number(edad.value);
  if (edad.value.trim() === '') {
    marcarError(edad, 'La edad es obligatoria.');
    return false;
  }
  if (!Number.isInteger(valorEdad) || valorEdad < 13 || valorEdad > 99) {
    marcarError(edad, 'La edad tiene que ser un número entero entre 13 y 99.');
    return false;
  }

  // Motivo
  if (motivo.value === '') {
    marcarError(motivo, 'Elegí un motivo de contacto.');
    return false;
  }

  // Preferencia de respuesta
  if (!respuesta) {
    marcarError(formulario.querySelector('input[name="respuesta"]'), 'Elegí cómo querés que te respondamos.');
    return false;
  }

  // Teléfono: obligatorio solo si eligió que lo llamen
  const valorTelefono = telefono.value.trim();
  if (respuesta.value === 'telefono' && valorTelefono === '') {
    marcarError(telefono, 'Elegiste respuesta por teléfono: ingresá tu número.');
    return false;
  }
  if (valorTelefono !== '' && !REGEX_TELEFONO.test(valorTelefono)) {
    marcarError(telefono, 'El teléfono solo puede tener números, espacios, +, - y paréntesis (mínimo 8 caracteres).');
    return false;
  }

  // Mensaje
  if (mensaje.value.trim() === '') {
    marcarError(mensaje, 'El mensaje es obligatorio.');
    return false;
  }
  if (mensaje.value.trim().length < 20) {
    marcarError(mensaje, 'El mensaje tiene que tener al menos 20 caracteres (escribiste ' + mensaje.value.trim().length + ').');
    return false;
  }

  // Términos
  if (!terminos.checked) {
    marcarError(terminos, 'Tenés que aceptar el uso de tus datos para poder enviar la consulta.');
    return false;
  }

  return true;
}

// Envío: si todo está bien, alert de éxito y reset
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  limpiarErrores();

  if (!validarFormulario()) {
    return;
  }

  const nombre = formulario.nombre.value.trim().split(' ')[0];
  alert('✅ ¡Gracias, ' + nombre + '! Tu mensaje se envió correctamente. Te vamos a responder a la brevedad.');
  formulario.reset();
});

// Al escribir se quita la marca roja
formulario.addEventListener('input', function (evento) {
  const contenedor = evento.target.closest('.campo');
  if (contenedor) {
    contenedor.classList.remove('campo--invalido');
  }
});

// El botón Limpiar también quita las marcas
formulario.addEventListener('reset', limpiarErrores);
