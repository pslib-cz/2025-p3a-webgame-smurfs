import styles from "./TutorialPopup.module.css"
import "../../../styles/globals.css"
import { useEffect, useState } from "react";
import { useControls } from "../../../Contexts/ControlsContext";
import { useGameSettings } from "../../../Contexts/GameSettingsContext";

export const TutorialPopup = () => {
    const { controls } = useControls();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const [timer, setTimer] = useState<number>(3);
    const [canInteract, setCanInteract] = useState<boolean>(false);
    const { showControls } = useGameSettings();

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
        setIsVisible(true);
        }
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (step === 2 && timer > 0) {
        interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        } else if (step === 2 && timer === 0) {
        setCanInteract(true);
        }

        return () => clearInterval(interval);
    }, [step, timer]);

    useEffect(() => {
        if (step === 2 && canInteract && controls.e) {
        finishTutorial();
        }
    }, [controls.e, canInteract, step]);

    const finishTutorial = () => {
        localStorage.setItem('hasSeenTutorial', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.tutorialPopup}>
            {step === 1 ? (
                <div className={styles.step1}>
                    <figure className={styles.tutorialPopup__image}>
                        <img src={!showControls ? "images/game_assets/ui/wasd_keys.svg" : "images/game_assets/ui/joystick_showcase.svg"} alt="Ukázka ovládání chození" />
                    </figure>
                    <div className={styles.tutorialPopup__content}>
                        <p>{!showControls ? "Chodíš pomocí kláves [WSAD]" : "Chodíš pomocí joysticku"}</p>
                        <button onClick={() => setStep(2)} className={styles.tutorialPopup__btn}>Další</button>
                    </div>
                </div>
            ) : (
                <div className={styles.step2}>
                    <figure className={styles.tutorialPopup__image}>
                        <img src={!showControls ? "images/game_assets/ui/e_key.svg" : "images/game_assets/ui/interaction_showcase.svg"} alt="Ukázka spuštění interakce" />
                    </figure>
                    <div className={styles.tutorialPopup__content}>
                        <p>{!showControls ? "Intraguješ pomocí klávesy [E]." : "Intraguješ pomocí klávesy [Action Button]."} Zajdi za Kutilem a interaguj s ním.</p>

                        {!canInteract ? (
                            <p className={styles.timer}>Počkej {timer}s...</p>
                        ) : (
                            <p className={styles.timer}>Interaguj s Kutilem...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}