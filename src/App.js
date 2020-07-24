import React, {useState, useEffect} from 'react';
import { useMediaQuery } from 'react-responsive';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';

function Display(props) {
  return (
    <Row  className="rounded shadow key display">
      <Col>
        <p small>{props.sequence}</p>
        <h1 id="display" >{props.display}</h1>
      </Col>
    </Row>
  );
}

function Operator(props) {
  return (
    <Row>
    <Col className={"key operator rounded shadow " + (props.isMediumScreen ? "right" : "centered")} id={props.id} operation={props.operation} onClick={props.onClick} >
      <h4>
    {props.display}
      </h4>
    </Col>
      </Row>
  );
}

function Number(props) {
  return (
    <Row>
    <Col className={"key number rounded shadow " + (props.isMediumScreen ? "right" : "centered")} id={props.id} value={props.value} onClick={props.onClick}>
      <h4>
      {props.value}
      </h4>
        </Col>
      </Row>
  );
}

function App(props) {
  const [numberDisplay, setNumberDisplay] = useState("0");
  const [sequenceDisplay, setSequenceDisplay] = useState("");
  const [operation, setOperation] = useState(null);
  const [factor, setFactor] = useState(null);
  const [nextFactor, setNextFactor] = useState(null);
  const [positive, setPositive] = useState(true);
  const isMediumScreen = useMediaQuery({query: '(min-width: 768px)'});
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  
  function solve() {
    let result;
    // eslint-disable-next-line
      switch(operation) {
        case "+":
          result = factor + nextFactor;
          break;
        case "-":
          result = factor - nextFactor;
          break;
        case "*":
          result = factor * nextFactor;
          break;
        case "/":
          result = factor/nextFactor;
          break;
      }
    return result;
  }
  
  function handleNumber(event) {
    let numberDisplayString = numberDisplay;
    let sequenceDisplayString = sequenceDisplay;
    let numberValue = event.currentTarget.getAttribute("value");
    console.log(`numberValue: `,numberValue);
    
    if (sequenceDisplay.includes("=")) {
      setNumberDisplay(numberDisplay + numberValue);
      setSequenceDisplay(sequenceDisplay + numberValue);
      console.log(`numberDisplayString : `, numberDisplayString);
      console.log(`numberDisplay: `, numberDisplay);
    }
    
    if (numberDisplayString.includes(".") && numberValue === ".") {
      console.log(typeof numberDisplayString);
      console.log(`numberDisplayString : `, numberDisplayString);
      console.log(`numberDisplay: `, numberDisplay);
      return;
    }
    
    if (!operation) {
      if (numberDisplay === "0") {
        setNumberDisplay(numberValue);
        setSequenceDisplay(numberValue);
        console.log(`numberDisplayString : `, numberDisplayString);
        console.log(`sequenceDisplayString: `, sequenceDisplayString);
      } else {
        numberDisplayString += numberValue;
        sequenceDisplayString += numberValue;
        setNumberDisplay(numberDisplayString);
        setSequenceDisplay(sequenceDisplayString);
        console.log(`numberDisplayString : `, numberDisplayString);
        console.log(`sequenceDisplayString: `, sequenceDisplayString);
      }
    }
    
    if (operation && !nextFactor && !positive) {
      numberValue = parseFloat(numberValue);
      let negativeNumber = 0 - numberValue;
      setNextFactor(negativeNumber);
      negativeNumber = negativeNumber.toString();
      setNumberDisplay(negativeNumber);
      sequenceDisplayString += negativeNumber;
      setSequenceDisplay(sequenceDisplayString);
      setPositive(true);
    } 
    
    if (operation && !nextFactor && positive) {
      setNumberDisplay(numberValue);
      sequenceDisplayString += numberValue;
      setSequenceDisplay(sequenceDisplayString);
      setNextFactor(parseFloat(numberValue));
    }
    
    if (operation && nextFactor) {
      sequenceDisplayString += numberValue;
      setSequenceDisplay(sequenceDisplayString);
      numberDisplayString += numberValue;
      setNumberDisplay(numberDisplayString);
      setNextFactor(parseFloat(numberDisplayString));
    }
 }
  
  function handleOperator(event) {
    let sequenceDisplayString = sequenceDisplay;
    let operator = event.currentTarget.getAttribute("operation");
    
    if (operation && nextFactor) {
      let result = solve();
      setNumberDisplay(result.toString());
      setFactor(result);
      setNextFactor(null);
      setOperation(operator);
      sequenceDisplayString += result;
      sequenceDisplayString += operator;
      setSequenceDisplay(sequenceDisplayString);
    }
    
    if (operation && !nextFactor && operation==="-" &&operator==="-" ) {
      return;
    }
    
    if (operation && !nextFactor && operator!=="-") {
      if (!positive) {
        setPositive(true);
      }
      
      let sequenceArr = sequenceDisplayString.split("");
      console.log(`sequenceArr: `, sequenceArr);
      sequenceArr.splice(-1, 1, operator);
      console.log(`sequenceArr: `, sequenceArr);
      sequenceDisplayString = sequenceArr.join("");
      setSequenceDisplay(sequenceDisplayString);
      console.log(`sequenceDisplayString: `, sequenceDisplayString);
      setOperation(operator);
    }
    
    if(operation && !nextFactor && operator ==="-") {
      positive ? setPositive(false) : setPositive(true)
    }
    
    if (!operation) {
      setFactor(parseFloat(numberDisplay));
      sequenceDisplayString += operator;
      setSequenceDisplay(sequenceDisplayString);
      setOperation(operator);
    }
  }
  
  function handleEquals() {
    let sequenceDisplayString = sequenceDisplay;
    if (!operation) {
      return;
    }
    if (operation && !nextFactor) {
      return;
    }
    if (operation && nextFactor) {
      let result = solve();
      setNumberDisplay(result.toString());
      sequenceDisplayString += "=";
      sequenceDisplayString += result;
      setSequenceDisplay(sequenceDisplayString);
      setFactor(result);
      setNextFactor(null);
      setOperation(null);
    }
  }
  
  function clear() {
   setNumberDisplay("0");
   setFactor(null);
   setOperation(null);
   setSequenceDisplay("");
   setPositive(true);
 }
 
  function multiplicativeInverse() {
    if (numberDisplay !== 0) {
      let result = 1/numberDisplay;
      setNumberDisplay(result.toString());
      setSequenceDisplay(result.toString());
      setFactor(null);
      setNextFactor(null);
      setOperation(null);
    } else {
      return;
    }
  }

  function squareRoot() {
    let result = Math.sqrt(numberDisplay);
    setNumberDisplay(result.toString());
    setSequenceDisplay(result.toString());
    setFactor(null);
    setNextFactor(null);
    setOperation(null);
  }

  useEffect(() => {
    if (sequenceDisplay.length >= 24) {
      let shortened = sequenceDisplay.substring(4);
      setSequenceDisplay(shortened);
    }
  }, [sequenceDisplay]);

  return (
  <Container fluid className={isPortrait ? "portrait" : ""} >
    <Row>
      <Col xs={12} md={8}>
      <Container className="calculator rounded shadow">
        <Display display={numberDisplay} sequence={sequenceDisplay} />
        <Row>
            <Col xs={3}>
            <Operator id="clear" operation="clear" display={(isMediumScreen ? "Clear" : "C")} onClick={clear} isMediumScreen={isMediumScreen} />
            </Col>
            <Col xs={3}>
              <Operator id="1/x"  operation="1/x" display="1/x" onClick={multiplicativeInverse} isMediumScreen={isMediumScreen} />
            </Col>
            <Col xs={3}>
              <Operator id="sqrt" operation="squareroot" display="&#x221A;" onClick={squareRoot} isMediumScreen={isMediumScreen} />
            </Col>
            <Col xs={3}>
              <Operator id="divide" operation="/" display="&divide;" onClick={handleOperator} isMediumScreen={isMediumScreen} />
            </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Number id="seven" value="7" onClick={handleNumber} isMediumScreen={isMediumScreen} />
          </Col>
          <Col xs={3}>
            <Number id="eight" value="8" onClick={handleNumber} isMediumScreen={isMediumScreen} />
          </Col>
          <Col xs={3}>
            <Number id="nine" value="9" onClick={handleNumber} isMediumScreen={isMediumScreen} />
          </Col>
          <Col xs={3}>
            <Operator id="multiply" operation="*" display="&times;" onClick={handleOperator}isMediumScreen={isMediumScreen} />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Number id="four" value="4" onClick={handleNumber} isMediumScreen={isMediumScreen} />
          </Col>
          <Col xs={3}>
            <Number id="five" value="5" onClick={handleNumber} isMediumScreen={isMediumScreen} />
          </Col>
          <Col xs={3}>
            <Number id="six" value="6" onClick={handleNumber} isMediumScreen={isMediumScreen} />
          </Col>
          <Col xs={3}>
            <Operator id="subtract" operation="-" display="&minus;" onClick={handleOperator} isMediumScreen={isMediumScreen} />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Number id="one" value="1" onClick={handleNumber} isMediumScreen={isMediumScreen} />
          </Col>
          <Col xs={3}>
            <Number id="two" value="2" onClick={handleNumber} isMediumScreen={isMediumScreen}  />
          </Col>
          <Col xs={3}>
            <Number id="three" value="3" onClick={handleNumber} isMediumScreen={isMediumScreen} />
          </Col>
          <Col xs={3}>
            <Operator id="add" operation="+" display="+" onClick={handleOperator} isMediumScreen={isMediumScreen} />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Number id="zero" value="0" onClick={handleNumber} isMediumScreen={isMediumScreen} />
          </Col>
          <Col xs={3}>
            <Number id="decimal" value="." onClick={handleNumber} isMediumScreen={isMediumScreen} />
          </Col>
          <Col xs={3}>
            <Operator id="equals" operation="=" display="=" onClick={handleEquals} isMediumScreen={isMediumScreen} />
          </Col>
        </Row>
      </Container>
      </Col>
      </Row>
      <div>Icons made by <a href="https://www.flaticon.com/authors/dinosoftlabs" title="DinosoftLabs">DinosoftLabs</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
    </Container>
  );
}

export default App;
