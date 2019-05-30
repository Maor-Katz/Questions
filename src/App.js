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
            clicked: '',
            gameOver: false,
            value:''

        }
        this.customStyles = {
            content: {
                top: '50%',
                left: '50%',
                height: '30%',
                width: '20%',
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

    answeredQuestion = () => {
        let {grade, currentQuestion, questions, clicked, numOfQuestions, gameOver} = this.state;
        if (questions[currentQuestion].correctAns === clicked) { //adding 25 point for correct answer
            debugger
            grade = grade + 25;
        }
        questions[currentQuestion] = {
            question: questions[currentQuestion].question,
            answers: questions[currentQuestion].answers,
            correctAns: questions[currentQuestion].correctAns,
            insertedValue: clicked
        }
        currentQuestion = currentQuestion + 1;
        if (currentQuestion === numOfQuestions) {
            currentQuestion = 0;
            gameOver = true;
        }
        this.setState({questions, grade, currentQuestion, gameOver})
    }

//value={questions[currentQuestion].insertedValue ?  questions[currentQuestion].insertedValue : "0"}
    render() {
        const {questions, grade, currentQuestion, numOfQuestions, gameOver, clicked} = this.state

        debugger
        return (
            <div className='App'>
                <h1 className='knockout'>Comm</h1>
                {questions[currentQuestion] && <form action="/action_page.php">
                    {<h3 className='questionDisplay'>{questions[currentQuestion].question}</h3>}
                    <label><input type="radio" value={this.state.clicked} checked={questions[currentQuestion].insertedValue===questions[currentQuestion].answers[0]}
                                  onClick={() => this.setState({clicked: questions[currentQuestion].answers[0]})} onClick={() => this.setState({clicked: questions[currentQuestion].answers[0]})}/>{questions[currentQuestion].answers[0]}
                    </label>
                    <label> <input type="radio" value={this.state.clicked} checked={questions[currentQuestion].insertedValue===questions[currentQuestion].answers[1]}
                                   onClick={() => this.setState({clicked: questions[currentQuestion].answers[1]})}/> {questions[currentQuestion].answers[1]}
                    </label>
                    <label><input type="radio" value={this.state.clicked} checked={questions[currentQuestion].insertedValue===questions[currentQuestion].answers[2]}
                                  onClick={() => this.setState({clicked: questions[currentQuestion].answers[2]})}/> {questions[currentQuestion].answers[2]}
                    </label>
                    <label> <input type="radio" value={this.state.clicked} checked={questions[currentQuestion].insertedValue===questions[currentQuestion].answers[3]}
                                   onClick={() => this.setState({clicked: questions[currentQuestion].answers[3]})}/> {questions[currentQuestion].answers[3]}
                    </label>
                </form>}


                <div className='questions'>
                       <span className='buttons'><Button variant="contained" color="secondary"
                                                         disabled={currentQuestion === 0 ? true : false}
                                                         onClick={() => this.setState({currentQuestion: currentQuestion - 1})}>
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
                                                              clicked: '',
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