# Recepción de consultas

Destino confirmado: **nahuelinguanta@lunasoftstudios.com**.

El formulario usa FormSubmit por AJAX y conserva al visitante en la página. El email del visitante se usa para poder responderle desde el mensaje recibido. No requiere contraseñas ni credenciales de Gmail en el código.

## Activación pendiente

1. Abrir el portafolio servido por HTTP/HTTPS y enviar una consulta de prueba desde el formulario. No abrir index.html como archivo local.
2. Revisar la bandeja y spam de nahuelinguanta@lunasoftstudios.com. FormSubmit envía un email de activación en el primer envío.
3. Confirmar la dirección con el enlace recibido.
4. Enviar una nueva consulta y comprobar su llegada, los cuatro campos y que Responder apunte al email del visitante.

El agente no realizó envíos reales ni activó la dirección. Los estados de éxito, error y activación se comprueban con respuestas simuladas. La recepción real queda pendiente de los pasos anteriores.

El formulario muestra éxito únicamente ante una respuesta positiva del servicio, nunca con un simple temporizador. Un error, timeout o petición de activación conserva los campos. La aceptación por el servicio no prueba la llegada a la bandeja: completar la comprobación anterior antes de publicar.

## Datos y mantenimiento

- Nombre, email y mensaje son obligatorios; teléfono opcional.
- Campo honeypot para filtrar bots y botón deshabilitado durante el envío.
- No se desactiva reCAPTCHA mediante `_captcha=false`; el servicio controla las protecciones aplicables a su endpoint AJAX.
- FormSubmit recibe los datos y documenta que guarda las consultas en su archivo durante 30 días. Revisar su política si se incorporan otros datos al formulario.
- Si el buzón del dominio no está conectado a Gmail, configurar esa recepción con el proveedor de correo. El formulario envía al buzón indicado, no crea una cuenta ni un reenvío a Gmail.

Referencias: https://formsubmit.co/ · https://formsubmit.co/documentation · https://formsubmit.co/ajax-documentation
