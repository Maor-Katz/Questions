import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            numOfQuestions: 4,
            grade: 0,
            currentQuestion: 0,
            gameOver: false,
        }
        this.customStyles = {
            content: {
                top: '50%',
                left: '50%',
                height: '13%',
                width: '18%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        };
    }

    componentWillMount() {
        const {questions} = this.state
        fetch('/data.json')
            .then(res => res.json())
            .then(data => {
                const x = questions.concat(data);
                this.setState({questions: x})
            })
    }

    previousQuestion = () => {
        let {grade, currentQuestion, questions} = this.state
        currentQuestion = currentQuestion - 1;
        if (questions[currentQuestion].insertedValue === questions[currentQuestion].correctAns) {
            grade = grade - 25;
        }
        this.setState({
            currentQuestion,
            grade
        })
    }

    answeredQuestion = () => {
        let {grade, currentQuestion, questions, numOfQuestions, gameOver} = this.state;
        if (questions[currentQuestion].correctAns === questions[currentQuestion].insertedValue) { //adding 25 point for correct answer
            grade = grade + 25;
        }
        currentQuestion = currentQuestion + 1;
        if (currentQuestion === numOfQuestions) {//case its the end of the game
            currentQuestion = 0;
            gameOver = true;
        }
        this.setState({questions, grade, currentQuestion, gameOver})
    }
    clickedValue = (e) => {
        const {questions, currentQuestion} = this.state
        questions[currentQuestion].insertedValue = e.target.value
        this.setState({questions})
    }

    render() {
        const {questions, numOfQuestions, gameOver} = this.state
        let {grade, currentQuestion} = this.state
        return (
            <div className='App'>
                <h1 className='knockout'>CommitIT</h1>
                {questions[currentQuestion] && <form action="insertDetails">
                    {<h3 className='questionDisplay'>{questions[currentQuestion].question}</h3>}
                    {questions[currentQuestion].answers.map((optionAns, index) => {
                        return <label><input type="radio" value={questions[currentQuestion].answers[index]}
                                             checked={questions[currentQuestion].insertedValue === questions[currentQuestion].answers[index]}
                                             onClick={(e) => this.clickedValue(e)}/>{questions[currentQuestion].answers[index]}
                        </label>
                    })}
                </form>}
                <div className='questions'>
                       <span className='buttons'><Button variant="contained" color="secondary"
                                                         disabled={currentQuestion === 0 ? true : false}
                                                         onClick={() => {
                                                             this.previousQuestion()
                                                         }}>
                            Previous
                        </Button></span>
                    <span className='buttons'><Button variant="contained" color="secondary"
                                                      onClick={() => this.answeredQuestion()}>
                            {currentQuestion === (numOfQuestions - 1) ? 'Done' : 'Next'}
                        </Button></span>
                </div>
                <Modal
                    isOpen={gameOver}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={this.customStyles}
                    contentLabel="Example Modal"
                >
                    <div className='modal'>
                        <div className='scoreDisplay'>Your Score: {grade}</div>
                        <span className='buttons'><Button variant="contained" color="secondary"
                                                          onClick={() => this.setState({
                                                              grade: 0,
                                                              currentQuestion: 0,
                                                              gameOver: false,
                                                          })} className='newGameButton'>
                            New Game
                        </Button></span>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default App