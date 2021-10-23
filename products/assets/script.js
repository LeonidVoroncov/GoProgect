function get() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET","/product");
    xhr.onload = function (event){
        let m = JSON.parse(event.target.response);
        console.log(m);

        for(let item of m){
            let slider = document.querySelector(".slider");
            let slide = document.createElement("div");
            let content = document.createElement("div");
            let h1 = document.createElement("h1");
            let p1 = document.createElement("p");
            let p2 = document.createElement("p");
            let img = document.createElement("img")

            slider.append(slide);
            slide.append(content, img);
            content.append(h1, p1, p2);

            slide.className = "slide";
            content.className = "text";

            h1.textContent = item.name;
            p1.textContent = item.desc;
            p2.textContent = item.price;
            img.src = "/img/" + item.image;
        }
    }
    xhr.send();
}

let btn = document.querySelector("#btn-sub");
btn.onclick = CreateProduct;


function change(){
    let popUp2 = document.querySelector(".pop-up.change");
    popUp2.classList.toggle("pop-up-active");

    let xhr = new XMLHttpRequest();
    xhr.open("GET","/product");
    xhr.onload = function (event){
        let m = JSON.parse(event.target.response);
        console.log(m);

        let block = document.querySelector(".pop-up-content.change");
        let oldTable = block.querySelector("table");
        if(oldTable){
            oldTable.remove();
            popUp2.classList.toggle("pop-up-active");
        }
        let table = document.createElement("table");
        table.className = "table";
        block.append(table);
        for(let item of m){
            let tr = document.createElement("tr");

            let name =  document.createElement("td");
            let desc = document.createElement("td");
            let imgConteiner = document.createElement("td");
            let price = document.createElement("td");

            let imgWrap = document.createElement("div");
            let img = document.createElement("img");

            let butCont = document.createElement("td");
            let chnButt = document.createElement("button");
            let delButt = document.createElement("button");

            chnButt.className = "change-button";
            delButt.className = "deleted-button";

            img.className = "img";
            imgWrap.className = "img-wrap";

            chnButt.textContent = "Изменить";
            delButt.textContent = "Удалить";

            name.textContent = item.name;
            desc.textContent = item.desc;
            img.src = "/img/" + item.image;
            price.textContent = item.price;

            imgConteiner.append(imgWrap);
            imgWrap.append(img);

            table.append(tr);
            tr.append(name, desc, imgConteiner, price, butCont);
            butCont.append(chnButt, delButt);

            tr.dataset.id = item.id;
        }
        let delProd = document.querySelectorAll(".deleted-button");

        for (let i=0; i< delProd.length;i++){
            delProd[i].onclick = DeleteProduct;
        }
    }
    xhr.send();
}


function DeleteProduct() {
    console.log(this.closest("tr").dataset.id)
    let idProd = +this.closest("tr").dataset.id;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/product");
    xhr.onload = ev =>{
        if(ev.target.response == "null"){
            get();
            change();
        }
    }
    xhr.send(JSON.stringify({id: idProd}));
}



let butChangeSlide = document.querySelector(".change-slide");
butChangeSlide.onclick = change;


function CreateProduct() {
    validation()
    let inputs =  this.parentElement.querySelectorAll('input:not([type = "file"])');
    let file = this.parentElement.querySelector('input[type = "file"]');

    let product = {};

    for ( let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "number") product[inputs[i].name] = inputs[i].valueAsNumber;
        else product[inputs[i].name] = inputs[i].value;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/upload");
    xhr.onload = res => {
        get();
        CreateMessage("Слайд дбавлен :)");
    };
    let form = new FormData();
    form.set("Image", file.files[0], file.files[0].name);
    xhr.send(form);

    product.image = file.files[0].name;
    console.log(product);

    xhr = new XMLHttpRequest();
    xhr.open("PUT", "/product");
    xhr.send(JSON.stringify(product));

}




let butAddSlide = document.querySelector(".add-slide");
let popUp = document.querySelector(".pop-up.add");
let popUp2 = document.querySelector(".pop-up.change");
let closePopUp = document.querySelector(".close");

butAddSlide.onclick = function () {
    popUp.classList.toggle("pop-up-active");
}

closePopUp.onclick = function () {
    popUp.classList.toggle("pop-up-active");
}

function ClosePopUp(){
    popUp2.classList.toggle("pop-up-active");
    let table = document.querySelector(".table");
    table.remove();
}

get();

function CreateMessage(msg) {
    let messageBox = document.querySelector(".message-box");

    if(!messageBox) {
        messageBox = document.createElement("div");
        messageBox.className = "message-box";
        document.body.append(messageBox);
    }
    let message = document.createElement("div");
    message.className = "message";
    message.textContent = msg;
    messageBox.append(message);

    message.onclick = function (){
        this.remove();
    }

    setTimeout(() => {
        message.remove();
    },10000)
}

const input = document.querySelectorAll('.input-box input');

function validation() {
    for(let i = 0;i<input.length;i++){
        if(input[i].value == ''){
            input[i].classList.add('_err');
        }
    }
}





