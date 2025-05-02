// var url = "http://localhost:3300/api/users";
var url = "https://users-api-mysql.onrender.com/";


function postUser() {
  console.log(url);

  var myName = $('#name').val();
  var myEmail = $('#email').val();
  var myAge = $('#age').val();
  var myComments = $('#comments').val();

  var myuser = {
    name: myName,
    email: myEmail,
    age: myAge,
    comments: myComments
  };

  console.log(myuser);

  $.ajax({
    url: url,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
      console.log("Usuario creado exitosamente:", data);
      // Mostrar mensaje de éxito temporal
      var mensaje = $('<div class="notification notification-success"><i class="fas fa-check-circle"></i> Usuario creado exitosamente</div>');
      $('#notifications').append(mensaje);
      
      // Quitar el mensaje después de 3 segundos
      setTimeout(function() {
        mensaje.fadeOut(function() {
          $(this).remove();
        });
      }, 3000);
      
      // Limpiar el formulario
      $('#id').val('');
      $('#name').val('');
      $('#email').val('');
      $('#age').val('');
      $('#comments').val('');
      
      // Refrescar la lista de usuarios
      getUsers();
    },
    error: function(xhr, status, error) {
      console.error("Error en POST:", error);
      console.error("Status:", status);
      console.error("Response Text:", xhr.responseText);
      $('#notifications').append('<div class="notification notification-danger"><i class="fas fa-times-circle"></i> Error al crear usuario: ' + error + '</div>');
    },
    data: JSON.stringify(myuser)
  });
}

function getUsers() {
  console.log("Iniciando getUsers() - URL:", url);
  
  // Verificar que el div resultado existe
  var resultadoDiv = $('#resultado');
  if (resultadoDiv.length === 0) {
    console.error("El div #resultado no existe en el documento!");
    return;
  }
  console.log("Div #resultado encontrado:", resultadoDiv);

  // Mostrar mensaje de carga
  resultadoDiv.html('<p class="text-center"><i class="fas fa-spinner fa-spin"></i> Cargando usuarios...</p>');

  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    success: function(json) {
      console.log('Respuesta JSON completa:', json);
      
      // Verificar si json es null o undefined
      if (!json) {
        console.error("La respuesta JSON es null o undefined");
        resultadoDiv.html('<p>Error: Respuesta vacía del servidor</p>');
        return;
      }
      
      // Verificar si json.users existe
      if (!json.users) {
        console.error("json.users no existe en la respuesta");
        resultadoDiv.html('<p>Error: No se encontró el campo "users" en la respuesta</p>');
        console.log("Estructura de la respuesta:", JSON.stringify(json));
        return;
      }

      var arrUsers = json.users;
      console.log('Array de usuarios:', arrUsers);
      
      // Verificar si arrUsers es un array
      if (!Array.isArray(arrUsers)) {
        console.error("json.users no es un array");
        resultadoDiv.html('<p>Error: El campo "users" no es un array</p>');
        return;
      }

      // Actualizar contador de usuarios
      $('#total-users').text(arrUsers.length);

      // Si no hay usuarios, mostrar un mensaje.
      if (arrUsers.length === 0) {
        console.log("No se encontraron usuarios");
        resultadoDiv.html('<p class="text-center">No se encontraron usuarios.</p>');
        return;
      }

      // Empezamos la tabla, asegurándonos de que esté correctamente estructurada.
      var htmlTableUsers = '<table>' +
        '<thead>' +
          '<tr>' +
            '<th>ID</th>' +
            '<th>Nombre</th>' +
            '<th>Email</th>' +
            '<th>Edad</th>' +
            '<th>Comentarios</th>' +
            '<th class="text-center">Acciones</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>';

      // Iteramos sobre los usuarios y creamos las filas de la tabla.
      arrUsers.forEach(function(item, index) {
        console.log('Usuario #' + index + ':', item);  // Verificación de cada usuario.

        htmlTableUsers += '<tr>' +
          '<td>' + (item.id || 'N/A') + '</td>' +
          '<td>' + (item.name || 'N/A') + '</td>' +
          '<td>' + (item.email || 'N/A') + '</td>' +
          '<td>' + (item.age || 'N/A') + '</td>' +
          '<td>' + (item.comments || 'N/A') + '</td>' +
          '<td>' +
            '<div class="table-actions">' +
              '<button onclick="prepareUpdate(' + item.id + ', \'' + 
              (item.name ? item.name.replace(/'/g, "\\'") : '') + '\', \'' + 
              (item.email ? item.email.replace(/'/g, "\\'") : '') + '\', ' + 
              (item.age || 0) + ', \'' + 
              (item.comments ? item.comments.replace(/'/g, "\\'") : '') + '\')" class="btn btn-warning">' +
              '<i class="fas fa-edit"></i></button> ' +
              '<button onclick="deleteUser(' + item.id + ')" class="btn btn-danger">' +
              '<i class="fas fa-trash-alt"></i></button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      });

      htmlTableUsers += '</tbody></table>';  // Cerramos la tabla correctamente.

      console.log('HTML generado para la tabla:', htmlTableUsers);  // Verificación del HTML generado.

      // Intentar insertar la tabla en el div 'resultado'
      try {
        resultadoDiv.html(htmlTableUsers);
        console.log("Tabla insertada en #resultado");
        
        // Verificar si la tabla está visible
        setTimeout(function() {
          if ($('#resultado table').length === 0) {
            console.error("La tabla no se encuentra en el DOM después de insertar");
          } else {
            console.log("Tabla encontrada en el DOM:", $('#resultado table'));
          }
        }, 100);
      } catch (err) {
        console.error("Error al insertar la tabla:", err);
        resultadoDiv.html('<p>Error al mostrar la tabla: ' + err.message + '</p>');
      }
    },
    error: function(xhr, status, error) {
      console.error("Error en GET:", error);
      console.error("Status:", status);
      console.error("Response Text:", xhr.responseText);
      resultadoDiv.html('<p>Error al obtener usuarios: ' + error + '</p>');
      $('#notifications').append('<div class="notification notification-danger"><i class="fas fa-times-circle"></i> Error al obtener usuarios: ' + error + '</div>');
    }
  });
}

function putUser() {
  console.log(url);

  var myId = $('#id').val();
  if (!myId) {
    $('#notifications').append('<div class="notification notification-warning"><i class="fas fa-exclamation-triangle"></i> Primero selecciona un usuario para actualizar.</div>');
    return;
  }

  var myName = $('#name').val();
  var myEmail = $('#email').val();
  var myAge = $('#age').val();
  var myComments = $('#comments').val();

  var myuser = {
    name: myName,
    email: myEmail,
    age: myAge,
    comments: myComments
  };

  console.log(myuser);

  $.ajax({
    url: url + '/' + myId,
    type: 'put',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
      console.log("Usuario actualizado exitosamente:", data);
      
      // Mostrar mensaje de éxito temporal
      var mensaje = $('<div class="notification notification-info"><i class="fas fa-info-circle"></i> Usuario actualizado exitosamente</div>');
      $('#notifications').append(mensaje);
      
      // Quitar el mensaje después de 3 segundos
      setTimeout(function() {
        mensaje.fadeOut(function() {
          $(this).remove();
        });
      }, 3000);
      
      // Limpiar el formulario
      $('#id').val('');
      $('#name').val('');
      $('#email').val('');
      $('#age').val('');
      $('#comments').val('');
      
      // Refrescar la lista después de actualizar
      getUsers();
    },
    error: function(xhr, status, error) {
      console.error("Error en PUT:", error);
      console.error("Status:", status);
      console.error("Response Text:", xhr.responseText);
      $('#notifications').append('<div class="notification notification-danger"><i class="fas fa-times-circle"></i> Error al actualizar usuario: ' + error + '</div>');
    },
    data: JSON.stringify(myuser)
  });
}

function deleteUser(id) {
  console.log("Eliminando usuario con ID: " + id);
  
  // Si no se proporciona un ID como parámetro, intentar obtenerlo del campo de entrada
  if (!id) {
    id = $('#id').val();
    if (!id) {
      $('#notifications').append('<div class="notification notification-warning"><i class="fas fa-exclamation-triangle"></i> Primero selecciona un usuario o ingresa un ID.</div>');
      return;
    }
  }

  if (!confirm('¿Está seguro de que desea eliminar este usuario?')) {
    return;
  }

  $.ajax({
    url: url + '/' + id,
    type: 'delete',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
      console.log("Usuario eliminado exitosamente:", data);
      
      // Mostrar mensaje de éxito temporal
      var mensaje = $('<div class="notification notification-danger"><i class="fas fa-trash-alt"></i> Usuario eliminado exitosamente</div>');
      $('#notifications').append(mensaje);
      
      // Quitar el mensaje después de 3 segundos
      setTimeout(function() {
        mensaje.fadeOut(function() {
          $(this).remove();
        });
      }, 3000);
      
      // Limpiar los campos del formulario
      $('#id').val('');
      $('#name').val('');
      $('#email').val('');
      $('#age').val('');
      $('#comments').val('');
      
      // Refrescar la lista
      getUsers();
    },
    error: function(xhr, status, error) {
      console.error("Error en DELETE:", error);
      console.error("Status:", status);
      console.error("Response Text:", xhr.responseText);
      $('#notifications').append('<div class="notification notification-danger"><i class="fas fa-times-circle"></i> Error al eliminar usuario: ' + error + '</div>');
    }
  });
}

function prepareUpdate(id, name, email, age, comments) {
  $('#id').val(id);
  $('#name').val(name);
  $('#email').val(email);
  $('#age').val(age);
  $('#comments').val(comments);
  
  // Desplaza la vista al formulario para mejor experiencia de usuario
  $('html, body').animate({
    scrollTop: $(".card:first").offset().top - 20
  }, 500);
}

// Función para limpiar el formulario
function clearForm() {
  $('#id').val('');
  $('#name').val('');
  $('#email').val('');
  $('#age').val('');
  $('#comments').val('');
}

// Ejecutar getUsers cuando el documento esté listo
$(document).ready(function() {
  console.log("Documento listo, llamando a getUsers()");
  getUsers();
});