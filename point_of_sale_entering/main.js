const data_base = {
    123: {name : "Mango", price : 45},
    124: {name : "Avocado", price : 75},
    125: {name : "Water", price : 2},
    126: {name : "Apple", price : 10}
};

var receipt = {};

var add_btn_element = document.getElementById("add-button");
add_btn_element.onclick = add_btn_click;

var submit_btn_element = document.getElementById("submit-btn");
submit_btn_element.onclick = submit_btn_click;

function add_btn_click(){
    var serial_input = document.getElementById("serial-input").value;
    var product = get_product(serial_input);
    if (product === undefined) {
        alert("product not found!");
        return false;
    }

    if (receipt[serial_input] !=  undefined){
        increase_quantity(serial_input);
        return true;
    }

    receipt[serial_input] = { quantity: 1, total_price: product.price};

    var row = create_row_element(product, serial_input);
    document.getElementById("table").appendChild(row);

    redraw_table();

    return true;
}

function create_row_element(product, serial_input){
    var row = document.createElement("tr");
    row.className = "table-row";
    row.id = String(serial_input);

    var name = creat_product_name_element(product);

    var delete_mark = creat_delete_mark_element();
    delete_mark.onclick = function(){
        delete_row(row)
    };

    name.appendChild(delete_mark);

    var price = creat_product_price_element(product);

    var quantity_container = creat_quantity_container_element(serial_input);

    var row_total = creart_row_total_element(product);

    row.appendChild(name);
    row.appendChild(price);
    row.appendChild(quantity_container);
    row.appendChild(row_total);
    return row;
}

function creat_product_name_element(product){
    var product_name = document.createElement("td");
    product_name.className = "name" 
    product_name.innerHTML = product.name;

    return product_name;
}

function creat_delete_mark_element(){
    var delete_mark = document.createElement("a");
    delete_mark.className = "delete";
    delete_mark.innerHTML = "X";

    return delete_mark;
}

function creat_product_price_element(product){
    var product_price = document.createElement("td");
    product_price.className = "price"     
    product_price.innerHTML = product.price;

    return product_price;
}

function creat_quantity_container_element(serial){
    var quantity_container = document.createElement("td");
    quantity_container.className = "quantity-container" 

    var quantity_value = creat_quantity_value_element();

    var minus_btn = creat_quantity_minus_btn();
    minus_btn.onclick = function(){decrease_quantity(serial)};

    var plus_btn = creat_quantity_plus_btn();
    plus_btn.onclick = function(){increase_quantity(serial)};

    quantity_container.appendChild(minus_btn);
    quantity_container.appendChild(quantity_value);
    quantity_container.appendChild(plus_btn);
    
    return quantity_container;
}

function creat_quantity_value_element(){
    var quantity_value = document.createElement("span");
    quantity_value.className = "quantity" 
    quantity_value.innerHTML = 1;

    return quantity_value;
}

function creat_quantity_minus_btn(){
    var minus_btn = document.createElement("a");
    minus_btn.className = "minus cell";
    minus_btn.innerHTML = " - ";

    return minus_btn;
}

function creat_quantity_plus_btn(){
    var plus_btn = document.createElement("a");
    plus_btn.className = "plus cell";
    plus_btn.innerHTML = " + ";

    return plus_btn;
}

function creart_row_total_element(product){
    var row_total = document.createElement("td");
    row_total.className = "row-total" 
    row_total.innerHTML = 1*product.price;

    return row_total;
}

function redraw_table(){
    var receipt_total_price = calculate_receipt_total();
    var serials = Object.keys(receipt);
    serials.forEach( serial =>{
        var row = document.getElementById(serial);
        row.getElementsByClassName("quantity")[0].innerHTML =
            receipt[serial].quantity;
        row.getElementsByClassName("row-total")[0].innerHTML =
            receipt[serial].total_price;
    });
    document.getElementById("receipt-total").innerHTML = receipt_total_price;
}


// TODO: this function need more enhancement 
// TODO: need to save receipt to json file
function submit_btn_click(){
    let serials = Object.keys(receipt);
    if (serials.length == 0){
        alert("cart is empty");
        return false;
    }
    let receipt_JSON = [];
    let receipt_total = calculate_receipt_total();
    serials.forEach((serial) => {
        let tmp = { name: '', price: '', quantity: '', total_price: '' };
        tmp.name = data_base[serial].name;
        tmp.price = data_base[serial].price;
        tmp.quantity = receipt[serial].quantity;
        tmp.total_price = receipt[serial].total_price;
        receipt_JSON.push(tmp);
    });
    receipt_JSON.push({total_to_pay: receipt_total});
    clear_table();
    console.log(JSON.stringify(receipt_JSON));

    alert("thank you, your receipt has been saved to console");
}

function delete_row(product_row){
    let product_serial = product_row.id;
    delete receipt[product_serial]; 
    product_row.remove();
    redraw_table();
}

function increase_quantity(product_serial){
    receipt[product_serial].quantity += 1;
    receipt[product_serial].total_price = data_base[product_serial].price * receipt[product_serial].quantity;
    redraw_table();
}

function decrease_quantity(product_serial){
    receipt[product_serial].quantity -= 1;
    receipt[product_serial].total_price = data_base[product_serial].price * receipt[product_serial].quantity;
    if (receipt[product_serial].quantity == 0){
        let row = document.getElementById(product_serial);
        delete_row(row);
    }
    redraw_table();
}

// deleting all rows of table
function clear_table() {
    // var table_element = document.getElementById('table');
    // var talbe_header_row_element = document.getElementById('table-header-row');
    // table_element.innerHTML = '';
    // table_element.appendChild(talbe_header_row_element);
    // unload_receipt();

    var table_rows = document.getElementsByClassName('table-row');
    for (let i = table_rows.length - 1; i >= 0; i--) {
        delete_row(table_rows[i]);
    }
}

function get_product(serial) {
    var product = data_base[serial];
    return product;
}

function calculate_receipt_total() {
    var receipt_total_price = 0;
    var serials = Object.keys(receipt);
    serials.forEach((serial) => {
        receipt_total_price += receipt[serial].total_price;
    });
    return receipt_total_price;
}
