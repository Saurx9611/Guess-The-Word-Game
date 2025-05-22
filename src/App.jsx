import { useState,useEffect,useRef } from "react"
import {clsx} from "clsx"
import{languages} from "./languages"
import { getFarewellText ,getRandomWord } from "./utlis"
import { words } from "./words"
import Confetti from "react-confetti"
export default function App(){
  const [currentWord,setCurrentWord]=useState(()=>getRandomWord())
  const [guessedLetter,setGuessedLetter]=useState([])
  const alphabet="abcdefghijklmnopqrstuvwxyz"
  const wrongGuessArr=guessedLetter.filter(letter=>!currentWord.includes(letter))
  const wrongGuessCount=wrongGuessArr.length
  const isGameLost=(wrongGuessCount>(languages.length-2))
  const isGameWon=currentWord.split("").every(letter => guessedLetter.includes(letter))
  const isGameOver=isGameWon || isGameLost
  const lastGuessedLetter=guessedLetter[guessedLetter.length -1 ]
  const islastGuessedIncorrect=lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
   const numGuessesLeft = languages.length - 1 - wrongGuessCount
  console.log(wrongGuessCount)
  function addGuessedLetter(letter){
       setGuessedLetter(prev=>
        prev.includes(letter) ? prev : [...prev,letter]
       )
  }
  function startNewGame(){
    setCurrentWord(getRandomWord())
    setGuessedLetter([])
  }
  // console.log(isGameOver)
  const languageEls=languages.map((lang,index)=>{
    const styles={
      backgroundColor:lang.backgroundColor,
      color:lang.color
    }
    const lostLang= index < wrongGuessCount
    const className=clsx("chip" , lostLang&& "lost")
    return (
    <span 
      className={className}
      style={styles}
      key={lang.name}
    >
        {lang.name}
    </span>
  )})
  function renderGameStatus() {
        if (!isGameOver && islastGuessedIncorrect) {
            return (
               <p className="farewell-message">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
            )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        } 
        if(isGameLost){
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }
        return null
    }
  const letterEls=currentWord.split("").map((letter,index)=>{
    const shouldRevealLetter=isGameLost || guessedLetter.includes(letter)
    const letterClassName = clsx(
            isGameLost && !guessedLetter.includes(letter) && "missed-letter"
    )
    return( <span key={index} className={letterClassName} >{shouldRevealLetter? letter.toUpperCase() : null}</span>)
  })
  const keyboardEls=alphabet.split("").map((alpha,index)=>{

    const isGuessed=guessedLetter.includes(alpha)
    const isCorrect= isGuessed && currentWord.includes(alpha)
    const isWrong= isGuessed && !currentWord.includes(alpha)
    const classname=clsx({
        correct:isCorrect,
        wrong:isWrong,
    })
    return (
    <button 
      className={classname}
      key={index}
      disabled={isGameOver}
      aria-disabled={guessedLetter.includes(alpha)}
      aria-label={`Letter ${alpha}`}
      onClick={()=> addGuessedLetter(alpha)}
    >
      {alpha.toUpperCase()}
    </button>
  )})
  const gameStatusClass=clsx("status-container", {
      won: isGameWon,
      lost:isGameLost,
      farewell: !isGameOver && islastGuessedIncorrect
  })
  return(
    <>
     <main>

       {
            isGameWon && 
             <Confetti
                recycle={false}
                numberOfPieces={1000}
            />
       }
       <section
       aria-live="polite" 
       role="status"
       className={gameStatusClass}>
        {renderGameStatus()}
       </section>
       <section className="language-chips">
          {languageEls}
       </section>
       <section className="word">
         {letterEls}
       </section>
       <section 
        className="sr-only"
        aria-live="polite" 
        role="status"
       >
           <p>
                    {currentWord.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
            </p>
           <p>Current word: {currentWord.split("").map(letter => 
                guessedLetter.includes(letter) ? letter + "." : "blank.")
                .join(" ")}
           </p>
       </section>
       <section className="keyboard">
         {keyboardEls}
       </section>

       { isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
     </main>
    </>
  )
}
