const express = require("express");
const fs = require("fs/promises");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("index page");
});

app.get("/products", async (req, res) => {
  const products = await fs.readFile("products.json", "utf-8");
  const parsedProducts = JSON.parse(products);
  res.status(200).json(parsedProducts);
});

app.get("/products/:id", async (req, res) => {
  const products = await fs.readFile("products.json", "utf-8");
  const parsedProducts = JSON.parse(products);
  const id = Number(req.params.id);
  const product = parsedProducts.find((el) => el.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

app.post("/products", async (req, res) => {
  const { name, category, price, description, stock, image } = req.body;

  if (!name || !category || !price || !description || !stock || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  
  const products = await fs.readFile("products.json", "utf-8");
  const parsedProducts = JSON.parse(products);

  
  const newId =
    parsedProducts.length > 0
      ? parsedProducts[parsedProducts.length - 1].id + 1
      : 1;

  
  const newProduct = {
    id: newId,
    name,
    category,
    price,
    description,
    stock,
    image,
  };

  
  parsedProducts.push(newProduct);

  
  await fs.writeFile("products.json", JSON.stringify(parsedProducts));

  res.status(201).json(newProduct);
});

app.delete("/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    const products = await fs.readFile("products.json", "utf-8");
    const parsedProducts = JSON.parse(products);

    const index = parsedProducts.findIndex(el => el.id === id);
    console.log(index);

    if (index === -1) {
        return res.status(400).json({ message: "Product not found" });
    }

    const deletedProduct = parsedProducts.splice(index, 1);

    await fs.writeFile("products.json", JSON.stringify(parsedProducts));

    
    return res.json({ message: "Product deleted", deletedProduct });
});

app.put("/products/:id", async (req,res) =>{
    const id = Number(req.params.id);
    const products = await fs.readFile("products.json", "utf-8");
    const parsedProducts = JSON.parse(products);

    const index = parsedProducts.findIndex(el => el.id === id);
    console.log(index);

    if (index === -1) {
        return res.status(400).json({ message: "Product not found" });
    }

    const { name, category, price, description, stock, image } = req.body;
    
    parsedProducts[index] = {
        ...parsedProducts[index],
        ...(name && { name }),
        ...(category && { category }),
        ...(price && { price }),
        ...(description && { description }),
        ...(stock && { stock }),
        ...(image && { image }),
    };

    await fs.writeFile("products.json", JSON.stringify(parsedProducts));

    res.status(200).json(parsedProducts[index]);
})

// დამატებითი ფუნქცია რომელიც შლის ყველა პროდუქტს
app.delete("/products", async (req, res) => {
  await fs.writeFile("products.json", ""); 
  res.json({ message: "All products deleted" });
});


app.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});

