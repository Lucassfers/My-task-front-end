import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";


type InputsCadastro = {
    nome: string
    email: string
    senha: string
    senha2: string
}

const apiUrl = import.meta.env.VITE_API_URL


export default function CadastroUsuario() {
    const { register, handleSubmit } = useForm<InputsCadastro>()
    const navigate = useNavigate()
    async function cadastrarUsuario(data: InputsCadastro) {
        if (data.senha !== data.senha2) {
            toast.error("Erro... As duas senhas precisam ser iguais.")
            return
        }

        try {
            const response = await fetch(`${apiUrl}/usuarios`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha
                })
            })

            if (response.status === 201) {
                toast.success("Cadastro realizado com sucesso!")
                navigate("/login")
            } else {
                const errorData = await response.json()
                if (errorData.erro) {
                    toast.error(errorData.erro)
                } else {
                    toast.error("Erro... Não foi possível realizar o cadastro.")
                }
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error)
            toast.error("Erro de conexão com o servidor.")
        }
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen">
            <div className="finisher-header absolute inset-0 w-full h-full" />

            <div className="relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg py-14 transition-colors z-10">
                <h1 className="text-2xl font-bold text-left mb-6">Cadastro de Usuários</h1>
                <form onSubmit={handleSubmit(cadastrarUsuario)} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Nome"
                            id="nome"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required {...register("nome")}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="E-mail"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required {...register("email")}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha de Acesso:</label>
                        <input type="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                            {...register("senha")} />
                        <p className="mt-1 text-xs text-gray-500">
                            A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.
                        </p>
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirme a Senha:</label>
                        <input type="password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                            {...register("senha2")} />
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Criar sua Conta</button>
                </form>
                <p className="flex justify-center text-gray-500 mb-7 transition-all hover:text-lg bg-transparent border-none cursor-pointer itemscenter mx-auto">
                    Já possui uma conta? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Faça Login</Link>
                </p>
            </div>
        </div>
    );
}
