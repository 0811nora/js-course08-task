import iconDel from '/icon-del.svg';


const baseUrl = 'https://livejs-api.hexschool.io';
const api_path = 't1win';

const showProductList = document.querySelector('#show-product-list');
const cartList = document.querySelector('#cartList');
const submitBtn = document.querySelector('#submitBtn');
const userForm = document.querySelector('#userForm');
const searchBar = document.querySelector('#search-bar');
const formInfor = document.querySelectorAll('.formInfor');
const alertMsg = document.querySelectorAll('.alert-msg');


let productsData = [];
let cartsData = [];
let orderDetail = {
    "data": {
        "user": {}
    }
}

getCartList();

// ---- [API:GET] - 所有商品資訊 -----
axios.get(`${baseUrl}/api/livejs/v1/customer/${api_path}/products`)
    .then((res)=>{
        console.log(res.data.products)
        productsData = res.data.products;
        allProducts();
    })
    .catch((err)=>{
        console.log('Error:',err)
    })


// ----- ［顯示］所有商品顯示在畫面上 -----
function allProducts(){
    let str = '';
    productsData.forEach((item,index)=>{
        str += renderProduct(item,index);
    })

    showProductList.innerHTML = str;
    addCart();

}


// ----- ［渲染］商品的資料 -----
function renderProduct(item,index){
    return `
        <div class="col-3">
            <div class="card rounded-0 border-0 w-100 mb-10">
            <div class="position-relative mb-3">
                <img src=${item.images} class="" alt="...">
                <span class="new-tag">新品</span>
                <a href="#" class="btn btn-primary border-0 p-3 w-100  position-absolute bottom-0 start-50 translate-middle-x" id="addCartBtn" data-num="${index}">加入購物車</a>
            </div>
            
            
            <div class="">
                <h4 class="fs-5">${item.title}</h4>
                <p class="fs-5"><del>NT$${item.origin_price.toLocaleString()}</del></p>
                <h5 class="fs-4 fw-bold">NT$${item.price.toLocaleString()}</h5>
            </div>
            </div>
        </div>
    `
}


// 點擊 [加入購物車] 觸發
function addCart(){
    const addCartBtn = document.querySelectorAll('#addCartBtn')
    
    addCartBtn.forEach((item)=>{
        item.addEventListener('click',(e)=>{
            e.preventDefault();

            let dataNum = e.target.dataset.num;
            let productId = '';

            productsData.forEach((item,index)=>{
                if(index == dataNum){
                    console.log(item.id)
                    productId = item.id;
                }
            })
            apiAddCart(productId);
        })
    })


}


// ---- [API:POST] - 加入購物車 -----
function apiAddCart(productId){
    axios.post(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`,{
            "data": {
                "productId": productId,
                "quantity": 1
            }
        })
        .then((res)=>{
            getCartList();
        })
        .catch((err)=>{
            console.log('ERROR:',err)
        })
}


// ---- [API:GET] - 取得購物車中的商品 -----
function getCartList(){
    axios.get(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
        .then((res)=>{
            cartsData = res.data.carts;
            console.log(cartsData);
            if(cartsData == ""){
                renderemptyCart();
                return;
            }else{
                allCartList();
                deleteBtn();
                deleteAllBtn();
            }
        })
}


// ---- ［顯示］購物車的所有商品顯示到畫面上 ----
function allCartList(){
    let str = ``;
    let totalPrice = 0
    cartsData.forEach((item,index)=>{
        str += renderCartList(item,index);
        totalPrice += item.product.price;
    })

    str += renderTablelast(totalPrice.toLocaleString());
    cartList.innerHTML = str;

}




// ----- ［渲染］購物車中的資料 -----
function renderCartList(item){
    return `
        <tr class="border-bottom">
            <td class="d-flex align-items-center py-6 border-0">
                <div style="width: 86px; height: 86px;">
                <img  src=${item.product.images} class="w-100 h-100" alt="">
                </div>
                <p class="ms-4 fs-5">${item.product.title}</p>
            </td>
            <td class="align-middle fs-5">NT$${item.product.price.toLocaleString()}</td>
            <td class="align-middle fs-5">1</td>
            <td class="align-middle fs-5">NT$${item.product.price.toLocaleString()}</td>
            <td class="align-middle text-end">
                <button class="btn" id="deleteBtn" data-id=${item.id}>
                    <img src="${iconDel}" alt="">
                </button>
            </td>
        </tr>
    `
}


// ----- ［渲染］購物車的總金額及刪除鈕 -----
function renderTablelast(price){
    return`
        <tr>
            <td>
            <div class="text-start py-3">
                <button class="btn btn-outline-primary deleteAllBtn"> 刪除全部商品</button>
            </div>
            </td>
            <td></td>
            
            <td colspan="4" class="py-3 text-end align-middle fs-3 fw-medium"><span class="fs-5 me-6">總金額</span> NT$${price}</td>
        </tr>
    `
}

// ----- ［渲染］購物車無資料時顯示 -----
function renderemptyCart(){
    let str = `
        <tr class="align-middle fs-2 ">
            <td colspan="5" class="py-12 bg-neutal-200" >您的購物車目前沒有商品</td>
        </tr>
    `
    cartList.innerHTML = str;
}


// ----- 搜尋商品時觸發 -----
searchBar.addEventListener('input',(e)=>{

    let txt = e.target.value;
    let str = ``;
    console.log(e.target.value);
    productsData.forEach((item,index)=>{
        if((item.title).includes(txt) || (item.category).includes(txt)){
            str += renderProduct(item,index);
        }
    })
    showProductList.innerHTML = str;
    addCart();
})


// 點擊 [刪除鈕-單] 觸發
function deleteBtn(){
    const deleteBtn = document.querySelectorAll('#deleteBtn');

    deleteBtn.forEach((item)=>{
        item.addEventListener('click',(e)=>{
            e.preventDefault();

            let btn = e.target.closest('#deleteBtn')
            deleteProduct(btn.dataset.id);
        })
    })
}

// 點擊 [刪除鈕-單] 觸發
function deleteAllBtn(){
    const deleteAllBtn = document.querySelector('.deleteAllBtn');

    deleteAllBtn.addEventListener('click',()=>{
        deleteAllProduct();
    })
}


// ---- [API:delete] - 刪除購物車中的單項商品 -----
function deleteProduct(id){
    axios.delete(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts/${id}`)
        .then((res) =>{ 
            getCartList();
        })
        .catch(err => console.log(err))
}

// ---- [API:delete] - 刪除購物車中的全部商品 -----

function deleteAllProduct(){
    axios.delete(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
        .then(()=>{
            getCartList();
            delAllSuccess();

        })
        .catch(err => console.log(err))
}


// 點擊 [送出預訂資料] 觸發
submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    if(cartsData.length === 0){
        emptyCart();
        return;
    }

    if(verify()){
        orderInfor();
        apiOrders();
        
    }

})


// ---- [API:POST] - 送出客戶訂單 -----
function apiOrders(){
    axios.post(`${baseUrl}/api/livejs/v1/customer/${api_path}/orders`,orderDetail)
        .then((res)=>{
            orderDetail = {"data": {"user": {}}}
            getCartList();
            userForm.reset();
            orderSuccess();
            
        })
        .catch((err)=>{console.log(err)})
}

// ---- 表單驗證並提示 -----
function verify(){
    let state = true;

    formInfor.forEach((item,index)=>{
        if(item.checkValidity()){
            alertMsg[index].innerHTML = "";
        }else{
            alertMsg[index].innerHTML = "必填！";
            item.reportValidity();
            state = false;
        }
    })
    return state;
}

// ---- 收集使用者資料，並放到orderDetail物件中 -----
function orderInfor(){
    let data = orderDetail.data.user;

    formInfor.forEach((item)=>{
        data[item.dataset.name]  = item.value
    })

    console.log(orderDetail)
}

// ---- ［通知］訂單送出成功的通知 -----
function orderSuccess(){
    iziToast.show({
        title: '訂單已成功送出，非常感謝您的預定！',
        position: 'bottomLeft',
        color: 'green',
    });
}

// ---- ［通知］購物車全部刪除成功的通知 -----
function delAllSuccess(){
    iziToast.show({
        title: '購物車商品已全部刪除',
        position: 'bottomLeft',
        color: 'green',
    });
}

// ---- ［通知］購物車無商品，卻按下預訂 -----
function emptyCart(){
    iziToast.show({
        title: '購物車無任何商品，請先選購商品。',
        position: 'bottomLeft',
        color: 'red',
    });
}

