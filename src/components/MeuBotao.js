export default function MeuBotao(){
    function buttonClick(){
       // alert("teste");
    }
    return(
        <div className='bar'>
          <button type="button" class="btn btn-light" onClick={buttonClick}><img src="https://viagemacessivel.com.br/wp-content/uploads/2019/02/cropped-Viagem-Acessível_Logotipol_Horizontal.png" alt="Imagem" style={{width: 200, height: 100}}/></button>
        </div>
    );
}