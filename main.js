

button.addEventListener('click', (e) => {
    let script = document.createElement('script')
    let functionName='callcall'+parseInt(Math.random()*100000,10)//随机函数名，避免污染全局变量，用完就delete

    window[functionName]=function(result){
        if(result==='success'){
            alert('支付成功')
            amount.innerText=amount.innerText-1
        }else{

        }
     }

    script.src='http://localhost:8002/pay?callback='+functionName//约定：这里的callbackName为callback
    document.body.appendChild(script)
    script.onload=function(e){
        e.currentTarget.remove()//删除每次点击执行时生成的script
        delete window[functionName]//随机函数只用一次，用完就去掉
    }
    script.onerror=function(e){
        alert('支付失败')
        e.currentTarget.remove()//同上
        delete window[functionName]
    }
})