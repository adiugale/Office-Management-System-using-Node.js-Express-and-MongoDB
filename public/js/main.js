const API = "http://localhost:5000";

let currentPage = 1;
let currentEditId = null;
let editDeptId = null;

async function loadDepartments() {
  const res = await fetch(`${API}/departments`);
  const data = await res.json();

  const dropdown = document.getElementById("department");
  dropdown.innerHTML = `<option value="">Select Department</option>`;

  data.forEach(d => {
    dropdown.innerHTML += `<option value="${d._id}">${d.name}</option>`;
  });
}

async function loadEmployees() {
  try {
    const search = document.getElementById("search").value;
    const job = document.getElementById("jobFilter").value;

    const res = await fetch(`${API}/employees?page=${currentPage}&search=${search}&jobTitle=${job}`);
    const data = await res.json();

    const table = document.getElementById("employeeTable");
    const supervisorDropdown = document.getElementById("supervisor");

    table.innerHTML = "";
    supervisorDropdown.innerHTML = `<option value="">Select Supervisor</option>`;

    if (!data.employees || data.employees.length === 0) {
      table.innerHTML = `<tr><td colspan="7" class="p-3 text-center text-gray-500">No employees found</td></tr>`;
      return;
    }

    data.employees.forEach(emp => {
      table.innerHTML += `
        <tr class="hover:bg-gray-50">
          <td class="p-3">${emp.name}</td>
          <td class="p-3">${emp.email}</td>
          <td class="p-3">${emp.jobTitle || 'N/A'}</td>
          <td class="p-3">${emp.department?.name || 'N/A'}</td>
          <td class="p-3">${emp.country ? `${emp.country}, ${emp.state}, ${emp.city}` : 'N/A'}</td>
          <td class="p-3">${emp.supervisor?.name || 'None'}</td>
          <td class="p-3">
            <button onclick="editEmployee('${emp._id}')" class="text-blue-600">Edit</button>
            <button onclick="deleteEmployee('${emp._id}')" class="text-red-600 ml-2">Delete</button>
          </td>
        </tr>
      `;

      supervisorDropdown.innerHTML += `<option value="${emp._id}">${emp.name}</option>`;
    });

  } catch (err) {
    console.error(err);
  }
}

async function loadCountries() {
  const res = await fetch("https://countriesnow.space/api/v0.1/countries");
  const data = await res.json();

  const dropdown = document.getElementById("country");
  dropdown.innerHTML = `<option value="">Select Country</option>`;

  data.data.forEach(c => {
    dropdown.innerHTML += `<option value="${c.country}">${c.country}</option>`;
  });
}

document.getElementById("country").addEventListener("change", async (e) => {
  const country = e.target.value;

  const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country })
  });

  const data = await res.json();

  const stateDropdown = document.getElementById("state");
  stateDropdown.innerHTML = `<option value="">Select State</option>`;

  data.data.states.forEach(s => {
    stateDropdown.innerHTML += `<option value="${s.name}">${s.name}</option>`;
  });
});

document.getElementById("state").addEventListener("change", async () => {
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;

  const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country, state })
  });

  const data = await res.json();

  const cityDropdown = document.getElementById("city");
  cityDropdown.innerHTML = `<option value="">Select City</option>`;

  data.data.forEach(city => {
    cityDropdown.innerHTML += `<option value="${city}">${city}</option>`;
  });
});

document.getElementById("employeeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    jobTitle: document.getElementById("jobTitle").value.trim(),
    department: document.getElementById("department").value || null,
    supervisor: document.getElementById("supervisor").value || null,
    country: document.getElementById("country").value,
    state: document.getElementById("state").value,
    city: document.getElementById("city").value
  };

  if (!body.name) return alert("Name is required");

  let res;

  if (currentEditId) {
    res = await fetch(`${API}/employees/${currentEditId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    currentEditId = null;
  } else {
    res = await fetch(`${API}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  }

  if (!res.ok) {
    const data = await res.json();
    return alert(data.error);
  }

  document.getElementById("employeeForm").reset();
  loadEmployees();
});

async function editEmployee(id) {
  const res = await fetch(`${API}/employees?page=1&limit=1000`);
  const data = await res.json();

  const emp = data.employees.find(e => e._id === id);
  if (!emp) return;

  document.getElementById("name").value = emp.name || "";
  document.getElementById("email").value = emp.email || "";
  document.getElementById("jobTitle").value = emp.jobTitle || "";
  document.getElementById("department").value = emp.department?._id || "";
  document.getElementById("supervisor").value = emp.supervisor?._id || "";
  document.getElementById("country").value = emp.country || "";

  currentEditId = id;
}

async function deleteEmployee(id) {
  if (!confirm("Delete employee?")) return;
  await fetch(`${API}/employees/${id}`, { method: "DELETE" });
  loadEmployees();
}

async function loadDepartmentList() {
  const res = await fetch(`${API}/departments`);
  const data = await res.json();

  const list = document.getElementById("deptList");
  list.innerHTML = "";

  data.forEach(d => {
    list.innerHTML += `
      <li class="flex justify-between items-center mb-2">
        <span>
          <strong>${d.name}</strong><br>
          <small class="text-gray-500">${d.description || ''}</small>
        </span>
        <div>
          <button onclick="editDept('${d._id}','${d.name}','${d.description || ''}')" class="text-blue-600 mr-2">Edit</button>
          <button onclick="deleteDept('${d._id}')" class="text-red-600">Delete</button>
        </div>
      </li>
    `;
  });
}

function editDept(id, name, desc) {
  editDeptId = id;
  document.getElementById("deptName").value = name;
  document.getElementById("deptDesc").value = desc || "";
}

async function addDepartment() {
  const name = document.getElementById("deptName").value.trim();
  const description = document.getElementById("deptDesc").value.trim();

  if (!name) return alert("Name required");

  let url = `${API}/departments`;
  let method = "POST";

  if (editDeptId) {
    url = `${API}/departments/${editDeptId}`;
    method = "PUT";
  }

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description })
  });

  const data = await res.json();

  if (!res.ok) return alert(data.error || "Error");

  editDeptId = null;

  document.getElementById("deptName").value = "";
  document.getElementById("deptDesc").value = "";

  loadDepartments();
  loadDepartmentList();
}

async function deleteDept(id) {
  if (!confirm("Delete department?")) return;

  const res = await fetch(`${API}/departments/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();

  if (!res.ok) return alert(data.error || "Delete failed");

  loadDepartments();
  loadDepartmentList();
}

function nextPage() {
  currentPage++;
  loadEmployees();
}

function prevPage() {
  if (currentPage > 1) currentPage--;
  loadEmployees();
}

document.getElementById("search").addEventListener("input", loadEmployees);
document.getElementById("jobFilter").addEventListener("input", loadEmployees);

loadDepartments();
loadEmployees();
loadCountries();
loadDepartmentList();