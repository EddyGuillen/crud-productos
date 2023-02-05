const d = document,
  $table = d.querySelector(".crud-table"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment(),
  $select = d.querySelector(".form-select"),
  $btnSearch = d.getElementById("btn-search"),
  $inputSearch = d.getElementById("input-search"),
  $form = d.querySelector(".crud-form"),
  $addProduct = d.getElementById("add-product"),
  $formAdd = d.getElementById("form-add"),
  $formEdit = d.getElementById("form-edit");

const getAll = async () => {
  try {
    let $options = `<option value="" selected>Seleccione Categoría</option>`,
      productsFetch = await fetch(`http://localhost:3000/products`),
      categoryFetch = await fetch(`http://localhost:3000/category`),
      [productsRes, categoryRes] = await Promise.all([
        productsFetch,
        categoryFetch,
      ]),
      productsData = await productsRes.json(),
      categoryData = await categoryRes.json();

    categoryData.forEach((el) => {
      $options += `<option value="${el.name}">${el.name}</option>`;
    });

    $select.innerHTML = $options;
    d.getElementById("select-modal").innerHTML = $options;
    d.getElementById("select-modal-edit").innerHTML = $options;

    productsData.forEach((el) => {
      $template.querySelector(".name").textContent = el.name;
      $template.querySelector(".category").textContent = el.category;
      $template.querySelector(".date").textContent = el.registrationDate;
      $template.querySelector(".stock").textContent = el.stock;
      $template.querySelector(".edit").dataset.id = el.name;
      $template.querySelector(".edit").dataset.name = el.name;
      $template.querySelector(".edit").dataset.category = el.category;
      $template.querySelector(".edit").dataset.stock = el.stock;
      $template.querySelector(".edit").dataset.registrationDate =
        el.registrationDate;
      $template.querySelector(".delete").dataset.id = el.id;

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });

    $table.querySelector("tbody").appendChild($fragment);
  } catch (err) {
    let message = err.statusText || "Ocurrió un error";
    $table.insertAdjacentElement(
      "afterend",
      `<p><b>Error ${err.status}: ${message}</b></p>`
    );
  }
};

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async (e) => {
  /* <----------- Search ---------->*/
  if (e.target === $form) {
    e.preventDefault();

    console.log("prueba");
    console.log($select.value);

    try {
      let res = await fetch(
        `http://localhost:3000/products?name_like=${$inputSearch.value}&&category_like=${$select.value}`
      );
      json = await res.json();

      if (!res.ok) throw { status: res.status, statusText: res.statusText };

      if (json.length > 0) {
        d.querySelector(".alert").textContent = "";
        json.forEach((el) => {
          $template.querySelector(".name").textContent = el.name;
          $template.querySelector(".category").textContent = el.category;
          $template.querySelector(".date").textContent = el.registrationDate;
          $template.querySelector(".stock").textContent = el.stock;
          $template.querySelector(".edit").dataset.id = el.name;
          $template.querySelector(".edit").dataset.name = el.name;
          $template.querySelector(".edit").dataset.category = el.category;
          $template.querySelector(".edit").dataset.stock = el.stock;
          $template.querySelector(".edit").dataset.registrationDate =
            el.registrationDate;
          $template.querySelector(".delete").dataset.id = el.id;

          let $clone = d.importNode($template, true);
          $fragment.appendChild($clone);
        });
        $table.querySelector("tbody").innerHTML = "";
        $table.querySelector("tbody").appendChild($fragment);
      } else {
        $table.querySelector("tbody").innerHTML = "";
        d.querySelector(".alert").textContent = "No se encontraron resultados";
      }
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      console.log(err);
      $table.insertAdjacentHTML(
        "afterend",
        `<p><b>Error ${err.status}: ${message}</b></p>`
      );
    }
  }

  /* CREATE-POST */
  if (e.target === $formAdd) {
    let date = new Date(Date.now());
    date = date.toLocaleDateString("en-GB");
    e.preventDefault();

    try {
      let options = {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            name: e.target.name.value,
            category: e.target.category.value,
            stock: e.target.stock.value,
            registrationDate: date,
          }),
        },
        res = await fetch("http://localhost:3000/products", options),
        json = await res.json();
      if (!res.ok) throw { status: res.status, statusText: res.statusText };
    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
      $formAdd.insertAdjacentHTML(
        "afterend",
        `<p><b>Error ${err.status}: ${message}</b></p>`
      );
    }
  }

  /* UPDATE- PUT */
  if (e.target === $formEdit) {
    try {
      let options;
    } catch (err) {}
  }
});
