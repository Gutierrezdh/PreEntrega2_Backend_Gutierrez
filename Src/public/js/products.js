const socket = io();
const addProductBtn = document.getElementById("addProductBtn");
const deleteProductBtn = document.getElementById("deleteProductBtn");


if (addProductBtn){
addProductBtn.addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  console.log(title, description, price, thumbnail, code, stock);
  const product = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  };

  socket.emit("addProduct", product);

  // Restablezco los valores de los campos del formulario
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("thumbnail").value = "";
  document.getElementById("code").value = "";
  document.getElementById("stock").value = "";
  alert("Producto agregado correctamente");
});
socket.on("updateProducts", (products) => {
    // Recargo la página para reflejar los cambios
    window.location.reload();
  });
}

if (deleteProductBtn){
deleteProductBtn.addEventListener("click", () => {
  const id = document.getElementById("productId").value;
  console.log(id);
  socket.emit("deleteProduct", id);
  document.getElementById("productId").value = "";
  alert("Producto eliminado");
});

socket.on("updateProducts", (products) => {
  // Recargo la página para reflejar los cambios
  window.location.reload();
});
}