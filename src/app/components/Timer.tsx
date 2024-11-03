import { useState, useCallback, useEffect, useRef } from 'react';
import PiPWindow from "../pip/PiPWindow";
import { usePiPWindow } from "../pip/PiPProvider";

function Timer() {
    const { isSupported, requestPipWindow, pipWindow, closePipWindow } = usePiPWindow();

    const [initialTime, setInitialTime] = useState(300);
    const [time, setTime] = useState(initialTime);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [inputTime, setInputTime] = useState({ minutes: 5, seconds: 0 });
    const [isReset, setIsReset] = useState(true);

    const startPiP = useCallback(() => {
        requestPipWindow(300, 150);
    }, [requestPipWindow]);

    useEffect(() => {
        if (isRunning && time > 0) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => Math.max(prevTime - 1, 0));
            }, 1000);
        } else if (time === 0) {
            setIsRunning(false);
            clearInterval(timerRef.current!);
        }

        return () => clearInterval(timerRef.current!);
    }, [isRunning, time]);

    const handleStartStop = () => {
        setIsReset(false);
        if (!isRunning) {
            const totalSeconds = (inputTime.minutes * 60) + inputTime.seconds;
            setInitialTime(totalSeconds);
            setTime(totalSeconds);
        }
        setIsRunning((prevState) => !prevState);
    };

    const handleReset = () => {
        setIsReset(true);
        const totalSeconds = (inputTime.minutes * 60) + inputTime.seconds;
        setInitialTime(totalSeconds);
        setTime(totalSeconds);
        setIsRunning(false);
        clearInterval(timerRef.current!);
        timerRef.current = null;
    };

    const formattedTime = `${Math.floor(time / 60)}:${time % 60 < 10 ? `0${time % 60}` : time % 60}`;

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col items-center">
            <div className="flex gap-2 mb-4">
                <button
                    onClick={handleStartStop}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {isRunning ? "Stop" : "Start"}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Reset
                </button>
            </div>
            <div className="text-xl font-mono mb-4">
                {isReset ? (
                    <>
                        <input
                            type="number"
                            value={isNaN(inputTime.minutes) ? "" : inputTime.minutes}
                            onChange={(e) => setInputTime({ ...inputTime, minutes: parseInt(e.target.value) })}
                        />
                        :
                        <input
                            type="number"
                            value={isNaN(inputTime.seconds) ? "" : inputTime.seconds}
                            onChange={(e) => setInputTime({ ...inputTime, seconds: parseInt(e.target.value) })}
                        />
                    </>
                ) : (
                    <span>{formattedTime}</span>
                )}
            </div>
            {isSupported ? (
                <>
                    <button
                        onClick={pipWindow ? closePipWindow : startPiP}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0f0f0f" viewBox="0 0 256 256"><path d="M216,48H40A16,16,0,0,0,24,64V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,64H216v56H136a8,8,0,0,0-8,8v64H40ZM216,192H144V136h72v56Z"></path></svg>
                    </button>
                    {pipWindow && (
                        <PiPWindow pipWindow={pipWindow}>
                            <div className="pipRoot p-2 bg-white rounded shadow">
                                <div className="text-xl font-mono">
                                    <span>{formattedTime}</span>
                                </div>
                            </div>
                        </PiPWindow>
                    )}
                </>
            ) : (
                <div className="error text-red-500">
                    Document Picture-in-Picture is not supported in this browser
                </div>
            )}
        </div>
    );
}

export default Timer;
