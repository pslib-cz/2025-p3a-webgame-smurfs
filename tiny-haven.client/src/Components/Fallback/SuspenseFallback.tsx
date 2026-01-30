import style from "./SuspenseFallback.module.css";

type SuspenseFallbackProps = {
    message: string;
}

export const SuspenseFallback: React.FC<SuspenseFallbackProps> = ({ message }) => {
    if (message === "World Ready!") return (
        <div className={style.fallback}>
            <p>{message}</p>
        </div>
    ) 
    else return (
        <div className={style.fallback}>
            <span className={style.loader}></span>
            <p>{message}</p>
        </div>
    )
}