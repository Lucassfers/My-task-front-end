import { useForm } from "react-hook-form";

import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import { useUsuarioStore } from "../context/UsuarioContext"

type Inputs = {
    nome: string
    email: string
    senha: string
    manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Cadastro() {
    const { register, handleSubmit } = useForm<Inputs>()
    const { logaUsuario } = useUsuarioStore()

    const navigate = useNavigate()

    // useEffect(() => {
    //     // garante que o script só roda depois do componente montar
    //     const script = document.createElement("script");
    //     script.src = "/finisher-header.es5.min.js";
    //     script.onload = () => {
    //         // @ts-ignore porque o TS não conhece FinisherHeader 
    //         new window.FinisherHeader({
    //             count: 12,
    //             size: { min: 1300, max: 1500, pulse: 0 },
    //             speed: { x: { min: 0.6, max: 1 }, y: { min: 0.6, max: 3 } },
    //             colors: {
    //                 background: "#fff",
    //                 particles: ["#1cffb3", "#87ddfe", "#231efe", "#5f0aff"], //514df roxo 274360 azul
    //             },
    //             blending: "lighten",
    //             opacity: { center: 0.6, edge: 0 },
    //             skew: 0,
    //             shapes: ["c"],
    //         });
    //     };
    //     document.body.appendChild(script);
    // }, []);

    async function verificaLogin(data: Inputs) {
        // alert(`${data.email} ${data.senha} ${data.manter}`)
        const response = await
            fetch(`${apiUrl}/usuarios/login`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ email: data.email, senha: data.senha })
            })

        // console.log(response)
        if (response.status == 200) {
            // toast.success("Ok!")            
            const dados = await response.json()

            // "coloca" os dados do cliente no contexto
            logaUsuario(dados)

            // se o cliente indicou que quer se manter conectado
            // salvamos os dados (id) dele em localStorage
            if (data.manter) {
                localStorage.setItem("clienteKey", dados.id)
            } else {
                // se indicou que não quer permanecer logado e tem
                // uma chave (anteriormente) salva, remove-a
                if (localStorage.getItem("clienteKey")) {
                    localStorage.removeItem("clienteKey")
                }
            }

            // carrega a página principal, após login do cliente
            navigate("/")
        } else {
            toast.error("Erro... Login ou senha incorretos")
        }
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen">
            {/* background animado */}
            <div className="finisher-header absolute inset-0 w-full h-full" />

            <div className="relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg py-14 transition-colors z-10">
                <h1 className="text-2xl font-bold text-left mb-6">Cadastro</h1>
                <form onSubmit={handleSubmit(verificaLogin)} className="space-y-4">
                    <input
                        type="nome"
                        placeholder="Nome"
                        id="nome"
                        className="w-full p-2 border-b-2 border-blue-500 focus:outline-none"
                        required {...register("nome")}
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        id="email"
                        className="w-full p-2 border-b-2 border-blue-500 focus:outline-none"
                        required {...register("email")}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        id="password"
                        className="w-full p-2 border-b-2 border-blue-500 focus:outline-none"
                        required {...register("senha")}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded transition-colors hover:bg-blue-700 tracking-widest my-7"
                    >
                        CONTINUE
                    </button>
                </form>
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="flex justify-center text-gray-500 mb-7 transition-all hover:text-lg bg-transparent border-none cursor-pointer itemscenter mx-auto"
                >
                    Já possui conta? Faça Login!
                </button>
            </div>
        </div>
    );
}
