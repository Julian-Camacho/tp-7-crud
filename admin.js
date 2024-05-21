const baseUsers = [
  {
    fullname: "Andy Miller",
    email: "Kyler.Schmeler@yahoo.com",
    phone: "(712) 411-1027 x032",
    bornDate: "1954-02-21T14:05:38.998Z",
    id: "1",
  },
  {
    fullname: "Dr. Glenda Parisian",
    email: "Walter_Pacocha@gmail.com",
    phone: "307.690.2924 x77563",
    bornDate: "1960-02-06T00:28:33.017Z",
    id: "2",
  },
  {
    fullname: "Wilbur Leuschke Jr.",
    email: "Eda_Renner43@gmail.com",
    phone: "499.444.2811",
    bornDate: "1968-09-22T09:40:26.035Z",
    id: "3",
  },
  {
    fullname: "Jose Ortiz",
    email: "Enrique_Nicolas@hotmail.com",
    phone: "986.783.7513 x83405",
    bornDate: "1983-03-04T18:05:45.304Z",
    id: "4",
  },
  {
    fullname: "Cecilia Hoppe",
    email: "Janie.Schulist@hotmail.com",
    phone: "367.780.0197 x62457",
    bornDate: "1958-03-21T09:02:43.322Z",
    id: "5",
  },
  {
    fullname: "Clifton Graham",
    email: "Toy_Hamill17@gmail.com",
    phone: "1-919-981-1071 x856",
    bornDate: "1973-09-05T17:43:41.255Z",
    id: "6",
  },
  {
    fullname: "Sheila Moen",
    email: "Alan_Dickens@hotmail.com",
    phone: "1-965-886-4462 x076",
    bornDate: "1993-10-22T01:22:14.713Z",
    id: "7",
  },
  {
    fullname: "Jenna Ernser",
    email: "Emmalee0@gmail.com",
    phone: "1-513-448-5219",
    bornDate: "1989-02-16T11:41:17.353Z",
    id: "8",
  },
  {
    fullname: "Ms. Pearl Schaden",
    email: "Nikolas.Jenkins7@gmail.com",
    phone: "(404) 536-7351 x75204",
    bornDate: "1996-10-06T19:13:10.063Z",
    id: "9",
  },
  {
    fullname: "Gregg Hodkiewicz",
    email: "Aliza91@gmail.com",
    phone: "937.434.3240 x6967",
    bornDate: "1972-02-25T08:25:40.933Z",
    id: "10",
  },
];

// URL base para trabajar con la API
const baseUrl = "https://6622ed3e3e17a3ac846e404e.mockapi.io/api/";

// Consigo los elementos del DOM para manipularlos
const tableHTML = document.getElementById("table-container");
const inputSearchHTML = document.getElementById("user-search");
const tableBodyHTML = document.getElementById("table-body");
const userFormHTML = document.getElementById("user-form");
const btnSumbitHTML = userFormHTML.querySelector('button[type="submit"]');
const formContainerHTML = document.querySelector(".user-form-container");

// Función para renderizar la tabla
function renderUsers(arrayUsers) {
  tableBodyHTML.innerHTML = "";
  arrayUsers.forEach((user, index) => {
    tableBodyHTML.innerHTML += `<tr>
                                      <td class="user-name">${user.fullname}</td>
                                      <td class="user-email">${user.email}</td>
                                      <td class="user-phone">${user.phone}</td>
                                      <td class="user-birthdate">${user.bornDate}</td>
                                      <td class="user-actions">
                                        <button class="btn btn-danger btn-sm" data-borrar="${user.id}">
                                          <i class="fa-solid fa-trash"></i>
                                        </button>
                                        <button class="btn btn-primary btn-sm" data-edit="${user.id}" >
                                          <i class="fa-solid fa-pencil"></i>
                                        </button>
                                      </td>
                                    </tr>`;
  });
}

renderUsers(baseUsers);


// Función para ordenar a los usuarios
// todo: Editar la función para que ordene a los usuarios en la API
document.getElementById("sortAsc").addEventListener("click", sortAsc);
document.getElementById("sortDesc").addEventListener("click", sortDesc);

function sortAsc() {
  const collator = new Intl.Collator(undefined, {
    sensitivity: 'base'
  });
  baseUsers.sort((a, b) => {
    return collator.compare(a.fullname, b.fullname)
  });
  renderUsers(baseUsers);
}

function sortDesc() {
  const collator = new Intl.Collator(undefined, {
    sensitivity: 'base'
  });
  baseUsers.sort((a, b) => {
    return collator.compare(b.fullname, a.fullname)
  });
  renderUsers(baseUsers);
}

// Función para buscar a los usuarios
inputSearchHTML.addEventListener("keyup", (evento) => inputSearch(evento));
function inputSearch(evt) {
    const search = evt.target.value.toLowerCase();
    const filteredUsers = baseUsers.filter((usr) => {
      if (usr.fullname.toLowerCase().includes(search)) {
        return true;
      }
      return false;
    })
    renderUsers(filteredUsers);
  }
// todo: Función para agregar usuarios nuevos
// todo: Función para editar a los usuarios por ID
// todo: Función para borrar a los usuarios por ID