// URL base para trabajar con la API
const baseUrl = "https://6622ed3e3e17a3ac846e404e.mockapi.io/api";

// Consigo los elementos del DOM para manipularlos
const tableHTML = document.getElementById("table-container");
const inputSearchHTML = document.getElementById("user-search");
const tableBodyHTML = document.getElementById("table-body");
const userFormHTML = document.getElementById("user-form");
const formTitleHTML = document.getElementById("form-title");
const btnSubmitHTML = userFormHTML.querySelector('button[type="submit"]');
const formContainerHTML = document.querySelector(".user-form-container");

// Variable para guardar a los usuarios
let users = [];

// Variable para saber si se está editando un usuario
let isEditing = null;

// Función para conseguir a los usuarios de la API
getUsers();

function getUsers() {
  axios
    .get(`${baseUrl}/users`)
    .then((respuesta) => {
      users = respuesta.data;
      renderUsers(users);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "¡Algo salió mal!",
        text: "No se pudo realizar la carga de usuarios ❌",
      });
      console.log("Error al obtener usuarios\n", error);
    });
}

// Función para renderizar la tabla
function renderUsers(arrayUsers) {
  tableBodyHTML.innerHTML = "";
  arrayUsers.forEach((user) => {
    tableBodyHTML.innerHTML += `<tr>
                                    <td class="user-name"><img src="${
                                      user.avatar
                                        ? user.avatar
                                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                    }" alt="${user.fullName}" class="user-avatar"></td> 
                                    <td class="user-name">${user.fullName}</td>
                                    <td class="user-email">${user.email}</td>
                                    <td class="user-phone">${user.phone}</td>
                                    <td class="user-birthdate">${transformTimestampToDate(
                                      user.bornDate
                                    )}</td>
                                    <td class="user-actions">
                                      <button class=" acction btn btn-danger btn-sm" data-borrar="${
                                        user.id
                                      }">
                                        <i class="fa-solid fa-trash"></i>
                                      </button>
                                      <button class=" acction btn btn-primary btn-sm" data-edit="${
                                        user.id
                                      }" >
                                        <i class="fa-solid fa-pencil"></i>
                                      </button>
                                    </td>
                                  </tr>`;
  });
  updateEditButtons();
  updateDeleteButtons();
}

function transformTimestampToDate(dateTimeStamp) {
  const dateFormat = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  dateTimeStamp += offset;
  const date = dateFormat.format(dateTimeStamp)

  return date;
}

// Función para ordenar a los usuarios
document.getElementById("sortAsc").addEventListener("click", sortAsc);
document.getElementById("sortDesc").addEventListener("click", sortDesc);

function sortAsc() {
  const collator = new Intl.Collator(undefined, {
    sensitivity: "base",
  });
  users.sort((a, b) => {
    return collator.compare(a.fullName, b.fullName);
  });
  renderUsers(users);
}

function sortDesc() {
  const collator = new Intl.Collator(undefined, {
    sensitivity: "base",
  });
  users.sort((a, b) => {
    return collator.compare(b.fullName, a.fullName);
  });
  renderUsers(users);
}

// Función para buscar a los usuarios
inputSearchHTML.addEventListener("keyup", (evento) => inputSearch(evento));
function inputSearch(evt) {
  const search = evt.target.value.toLowerCase();
  const filteredUsers = users.filter((usr) => {
    if (usr.fullName.toLowerCase().includes(search)) {
      return true;
    }
    return false;
  });
  renderUsers(filteredUsers);
}

// Función de alta o edición de usuario

userFormHTML.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const el = evento.target.elements;
  const usuarioEnForm = {
    fullName: el.fullName.value,
    email: el.email.value,
    phone: el.phone.value,
    bornDate: new Date(el.bornDate.value).getTime(),
    avatar: el.avatar.value,
  };

  if (isEditing) {
    //Buscar un usuario y reemplazarlo
    axios
      .put(`${baseUrl}/users/${isEditing}`, usuarioEnForm)
      .then(() => {
        getUsers();
        Swal.fire({
          icon: "success",
          title: "¡Genial!",
          text: "El usuario fue editado correctamente",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "¡Algo salió mal!",
          text: "No pudimos registrar los cambios",
        });
        console.log("Error al editar usuario\n", error);
      });
  } else {
    //Agregar un usuario nuevo
    axios
      .post(`${baseUrl}/users`, usuarioEnForm)
      .then(() => {
        getUsers();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Usuario registrado con éxito",
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "¡Algo salió mal!",
          text: "No pudimos registrar los cambios",
        });
      });
  }

  //Reset el formulario
  isEditing = null;
  formContainerHTML.classList.remove("form-edit");
  btnSubmitHTML.classList.add("btn-primary");
  btnSubmitHTML.classList.remove("btn-success");
  formTitleHTML.innerHTML = "Registro";
  btnSubmitHTML.innerText = "Registrar";

  userFormHTML.reset();
  el.fullName.focus();
});

// Actualizar los botones de editar
function updateEditButtons() {
  const userButtonEdit = document.querySelectorAll("button[data-edit]");

  userButtonEdit.forEach((btn) => {
    btn.addEventListener("click", (evt) => {
      const id = evt.currentTarget.dataset.edit;
      completeUserForm(id);
    });
  });
}

function completeUserForm(idUser) {
  isEditing = idUser;
  const user = users.find((usr) => {
    if (usr.id === idUser) {
      return true;
    }
    return false;
  });

  if (!user) {
    Swal.fire("Error", "No se encontro usuario");
    return;
  }
  // Rellenar el formulario con los datos de este usuario
  const el = userFormHTML.elements;

  el.fullName.value = user.fullName;
  el.email.value = user.email;
  el.phone.value = user.phone;
  el.bornDate.valueAsNumber = user.bornDate;
  el.avatar.value = user.avatar;

  formContainerHTML.classList.add("form-edit");
  btnSubmitHTML.classList.remove("btn-primary");
  btnSubmitHTML.classList.add("btn-success");
  formTitleHTML.innerHTML = `Editar usuario: </br>${user.fullName}`;
  btnSubmitHTML.innerText = "Editar";
}

// Actualizar los botones de eliminar y eliminar usuario
function updateDeleteButtons() {
  const userButtonsDelete = document.querySelectorAll("button[data-borrar]");
  userButtonsDelete.forEach((btn) => {
    btn.addEventListener("click", (evt) => {
      const id = evt.currentTarget.dataset.borrar;

      Swal.fire({
        title: "¿Estás seguro?",
        text: "Estás por eliminar un usuario",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2b285b",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${baseUrl}/users/${id}`)
            .then(() => {
              getUsers();
              Swal.fire({
                icon: "success",
                title: "¡Genial!",
                text: "El usuario fue eliminado correctamente",
              });
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "¡Algo salió mal!",
                text: "No se pudo eliminar el usuario",
              });
            });
        }
      });
    });
  });
}
