const url = 'https://agenda-api-14ee.onrender.com/api/agendas' 
//url de la api. Al desplegarla en el servidor local colocar la api del servi
const listar = async() => {
    let respuesta = ''
    let body = document.getElementById('contenido')
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then((resp) => resp.json()) // Obtener la respuesta y convertirla a json
    .then(function(data){
        let listaAgendas = data.agendas
        listaAgendas.map(function(agenda){
            respuesta += `<tr><td>${agenda._id}</td>`+
                        `<td>${agenda.hora_inicio}</td>`+
                        `<td>${agenda.hora_fin}</td>`+
                        `<td>${agenda.instructor}</td>`+
                        `<td>${agenda.clase}</td>`+
                        `<td>${agenda.dia}</td>`+
                        `<td>${agenda.estado}</td>`+
                        `<td><a class="waves-effect waves-light btn modal-trigger" href="#modal1" onclick='editar(${JSON.stringify(agenda)})'>Editar</a>
                        <a class="waves-effect waves-light btn modal-denger red"  onclick='eliminar(${JSON.stringify(agenda)})'>Eliminar</a></td></tr>`  
                        body.innerHTML = respuesta

        })
    })
    //alert('En desarrollo...')
}

const registrar = async()=>{

    let _hora_inicio = document.getElementById('hora_inicio').value
    let _hora_fin = document.getElementById('hora_fin').value
    let _instructor = document.getElementById('instructor').value
    let _clase = document.getElementById('clase').value
    let _dia = document.getElementById('dia').value
    let _estado = document.getElementById('estado').options[document.getElementById('estado').selectedIndex].value;

    let fechaActual = new Date().toISOString().split('T')[0];

    
    // Validar que el día no sea anterior a la fecha actual
    if (_dia < fechaActual) {
      Swal.fire(
        'No es posible registrar una Agenda en días anteriores a la fecha actual',
        '',
        'error'
      );
      return; // Detener la ejecución de la función
    }

    if(_hora_inicio< _hora_fin){
        let _agenda = {
            hora_inicio: _hora_inicio,
            hora_fin:_hora_fin,
            instructor:_instructor ,
            clase: _clase,
            dia: _dia,
            estado: _estado
        }
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(_agenda), //Convertir el objeto usuario a un JSON
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then((resp) => resp.json()) // Obtener la respuesta y convertirla a JSON
        .then(json   =>{
           // alert(json.msg)
           Swal.fire(
            json.msg,
            '',
            'success'
          )
          setTimeout(function() {
            window.location.href = "listar.html";
          }, 3000);

        })

    } else {
     //alert('El Password y la Confirmar de Password no coinciden. Por favor corregir')
     Swal.fire(
        'La hora de Inicio debe ser menor a la Hora Final',
        '',
        'error'
      )
}
}


const editar = (agenda) => {
    document.getElementById('id').value = agenda._id;
    document.getElementById('hora_inicio').value = agenda.hora_inicio;
    document.getElementById('hora_fin').value = agenda.hora_fin;
    document.getElementById('instructor').value = agenda.instructor;
    document.getElementById('clase').value = agenda.clase;
    document.getElementById('dia').value = agenda.dia;
    document.getElementById('estado').value = agenda.estado;
}

const actualizar = async () => {
    const _id = document.getElementById('id').value;
    const _hora_inicio = document.getElementById('hora_inicio').value;
    const _hora_fin = document.getElementById('hora_fin').value;
    const _instructor = document.getElementById('instructor').value;
    const _clase = document.getElementById('clase').value;
    const _dia = document.getElementById('dia').value;
    const _estado = document.getElementById('estado').value;

    let fechaActual = new Date().toISOString().split('T')[0];

    if (!_clase || !_instructor || !_dia || !_hora_inicio || !_hora_fin || !_estado) {
        Swal.fire(
          'Todos los campos son obligatorios',
          '',
          'error'
        );
        return; // Detener la ejecución de la función
      }

    if (_dia < fechaActual) {
        Swal.fire(
          'No es posible registrar una Agenda en días anteriores a la fecha actual',
          '',
          'error'
        );
        return; // Detener la ejecución de la función
      }

      if(_hora_inicio< _hora_fin){
        let _agenda = {
            _id:_id,
            hora_inicio: _hora_inicio,
            hora_fin: _hora_fin,
            instructor: _instructor,
            clase: _clase,
            dia: _dia,
            estado: _estado
        };

      
        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(_agenda),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
            .then((resp) => resp.json())
            .then(json => {
                Swal.fire({
                    title: json.msg,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            })
            .catch(error => {
                console.error(error);
                Swal.fire(
                    'Ocurrió un error al actualizar el hurto. Por favor, inténtalo nuevamente.',
                    '',
                    'error'
                );
            });
    } else {
        Swal.fire(
           'La hora de Inicio debe ser menor a la Hora Final',
           '',
           'error'
         )
   }
}


const eliminar = (id) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar esta agenda?',
      text: '¡Este cambio no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Eliminado',
          'El archivo ha sido eliminado.',
          'success'
        );
        
        let agenda = {
          _id: id
        };
        
        fetch(url, {
          method: 'DELETE',
          mode: 'cors',
          body: JSON.stringify(agenda),
          headers: {'Content-type': 'application/json; charset=UTF-8'}
        })
        .then((resp) => resp.json())
        .then((json) => {
          Swal.fire(
            json.msg,
            'Se ha eliminado exitosamente',
            'success'
          );
          setTimeout(function() {
            window.location.href = 'listar.html';
          }, 3000);
        });
      } else {
        Swal.fire(
          'Cancelado',
          'La eliminación ha sido cancelada.',
          'info'
        );
      }
    });
  };
  

if(document.querySelector('#btnRegistrar')){
    document.querySelector('#btnRegistrar')
    .addEventListener('click', registrar)
}
if(document.querySelector('#btnActualizar')){
    document.querySelector('#btnActualizar')
    .addEventListener('click', actualizar)
}
/* // ELIMINAR DATOS
const eliminar = async()=>{
    let _id = document.getElementById('id').value
    if(_id.length > 0){ */
