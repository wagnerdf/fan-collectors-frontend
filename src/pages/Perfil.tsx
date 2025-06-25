export default function Perfil() {
  const dadosFicticios = [
    { label: "Nome", value: "João" },
    { label: "Sobrenome", value: "Silva" },
    { label: "Email", value: "joao.silva@email.com" },
    { label: "Telefone", value: "(11) 91234-5678" },
    { label: "Data de Nascimento", value: "1990-05-20" },
    { label: "CPF", value: "123.456.789-00" },
    { label: "Sexo", value: "Masculino" },
    { label: "Endereço", value: "Rua das Flores" },
    { label: "Número", value: "123" },
    { label: "Complemento", value: "Apto 45" },
    { label: "Bairro", value: "Jardim Central" },
    { label: "Cidade", value: "São Paulo" },
    { label: "Estado", value: "SP" },
    { label: "País", value: "Brasil" },
    { label: "CEP", value: "01234-567" },
  ];

  return (
    <div className="w-full h-full p-0">
      <div className="bg-gray-900 rounded-2xl shadow-md p-6 h-full overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-white">Perfil do Usuário</h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          {dadosFicticios.map((campo, index) => (
            <div key={index} className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-300">{campo.label}</label>
              <input
                type="text"
                value={campo.value}
                readOnly
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none text-gray-400 cursor-not-allowed"
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}
