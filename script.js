

function cadastrarRegistro(nome,imagem,valor,qtd) {
    
    // Captura os valores do formulário
    
    var  nome = document.getElementById("nome").value;
    var  imagem = document.getElementById("imagem").value;
    var  valor = document.getElementById("valor").value;
    var  qtd = document.getElementById("qtd").value;
    
    // Cria um objeto com os dados a serem enviados
    var data = {
        nome: nome,
        imagem: imagem,
        valor: valor,
        qtd: qtd        
    };

    // Envia os dados para o servidor
    fetch('http://localhost:8080/produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar registro.');
            
        }
        return response.json();
    })
    .then(data => {
        console.log( 'Registro cadastrado com sucesso:', data);
        alert("Cadastro realizado com sucesso !")
        fetchDataAndPopulateTable();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
     
     document.getElementById("nome").value ="";
     document.getElementById("imagem").value ="";
     document.getElementById("valor").value ="";
     document.getElementById("qtd").value ="";    
    // window.location.href = "";
   
}
function validarFormulario() { 
      
    var nome = document.getElementById('nome').value;
    var imagem = document.getElementById('imagem').value;
    var validade = document.getElementById('valor').value;
    var quantidade = document.getElementById('qtd').value;
   
    if (nome === '') {
        alert('Por favor, preencha o campo Nome.');
        return false;
    }
    if (imagem === '') {
        alert('Por favor, preencha o campo imagem.');
        return false;
    }
    if (valor === '') {
        alert('Por favor, preencha o campo valor.');
        return false;
    }
    if (qtd === '') {
        alert('Por favor, preencha o campo quantidade.');
        return false;
    }

    
    // Se a validação passar, você pode chamar a função para salvar os registros
     cadastrarRegistro(nome,imagem,validade,quantidade);

    // Retorna true para permitir o envio do formulário após salvar os registros
    return true;
}
async function fetchDataAndPopulateTable() {
    try {
      // Substitua 'URL_DA_SUA_API' pela URL real da sua API
      const response = await fetch( 'http://localhost:8080/produto');
      const data = await response.json();

      // Limpa a tabela antes de inserir novos dados
      const tbody = document.querySelector('#tabela tbody');
      tbody.innerHTML = '';

      // Preenche a tabela com os dados recebidos da API
      data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.nome}</td>
          <td><img src="${item.imagem}" alt="${item.nome}" style="max-width: 100px; max-height: 100px;"></td>
          <td>${item.valor}</td>
          <td>${item.qtd}</td>         
          <td><button  class="btn btn-success"  onclick="buscarPorId(${item.id})">Editar</button></td>          
          <td><button  class="btn btn-danger" onclick="deletarRegistro(${item.id})">Excluir</button></td>`;
                       
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Erro ao buscar e preencher dados:', error);
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
  // Chama a função para buscar e preencher os dados quando a página carrega
   fetchDataAndPopulateTable();
});

async function updateUserData() {    
    const idInput =  document.getElementById("id");
    const nomeInput = document.getElementById("nome"); 
    const imagemInput = document.getElementById("imagem");
    const valorInput = document.getElementById("valor");
    const qtdInput = document.getElementById("qtd");
    
    
      
    const updateId =  idInput.value
    const updateNome = nomeInput.value  
    const updateImagem = imagemInput.value
    const updateValor = valorInput.value 
    const updateQtd = qtdInput.value 
   
  
    try {
      const response =  await fetch(`http://localhost:8080/produto`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updateId,
          nome: updateNome, 
          imagem:updateImagem,        
          valor: updateValor,
          qtd: updateQtd,
          
          
          
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }
  
      alert('Dados do usuário atualizados com sucesso!');
      fetchDataAndPopulateTable();          
    } catch (error) {
      console.error(`Erro durante a atualização dos dados: ${error.message}`);
    }
    document.getElementById("nome").value = "";   
    document.getElementById("valor").value ="";
    document.getElementById("qtd").value ="";
    
  }
 

 
    function preencherFormulario(user) {
    document.getElementById('id').value = user.id;
    document.getElementById('nome').value = user.nome;
    document.getElementById('imagem').value = user.imagem;
    document.getElementById('valor').value = user.valor;          
    document.getElementById('qtd').value = user.qtd;
    console.log('Registro encontrado:', user);

   }
  
   



  function showModal() {
    var myModal = document.getElementById('myModal');
    if (myModal) {
        var myInput = document.getElementById('myInput');
        if (myInput) {
            myModal.addEventListener('shown.bs.modal', function () {
                myInput.focus();
            });
            var modalInstance = new bootstrap.Modal(myModal);
            modalInstance.show();
        } else {
            console.error("Elemento 'myInput' não encontrado.");
        }
    } else {
        console.error("Elemento 'myModal' não encontrado.");
    }
}

 function buscarPorId(id) {
   fetch('http://localhost:8080/produto/' + id)
    .then(response => response.json())    
    .then(user => {
      preencherFormulario(user) ;
      showModal();
    
    })
    .catch(error => console.error('Error fetching user data:', error));
}

  function preencherFormulario(user) {
  document.getElementById('id').value = user.id;
  document.getElementById('nome').value = user.nome;
  document.getElementById('imagem').value = user.imagem;
  document.getElementById('valor').value = user.valor;
  document.getElementById('qtd').value = user.qtd;
   

}


async function deletarRegistro(id) {
  try {
      
      const url = `http://localhost:8080/produto/${id}`;

      
      const confirmacao = confirm("Tem certeza que deseja excluir o produto?");

      
      if (confirmacao) {
          const options = {
              method: 'DELETE'
          };

          const response = await fetch(url, options);
          if (!response.ok) {
              throw new Error('Erro ao deletar o produto');
          }

          console.log('Registro deletado com sucesso');
          
      } else {
          console.log('Exclusão cancelada pelo usuário');
          
      }
  } catch (error) {
      console.error('Erro:', error);
      
  }
  fetchDataAndPopulateTable();
}