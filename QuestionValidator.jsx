import React, { useState, useEffect } from 'react';

// Tipos para TypeScript
interface Question {
  question: string;
  options: number[];
  correct: number;
  isFinal: boolean;
  theme?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
}

const QuestionValidator: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Función para generar preguntas de promedio apropiadas para niños
  const generateChildFriendlyAverageQuestion = (isFinal: boolean): Question => {
    const questionTypes = ['simple', 'medium', 'advanced'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (type) {
      case 'simple':
        return generateSimpleAverageQuestion(isFinal);
      case 'medium':
        return generateMediumAverageQuestion(isFinal);
      case 'advanced':
        return generateAdvancedAverageQuestion(isFinal);
      default:
        return generateSimpleAverageQuestion(isFinal);
    }
  };

  // Preguntas simples: 2-3 números, resultados < 50
  const generateSimpleAverageQuestion = (isFinal: boolean): Question => {
    const numCount = Math.floor(Math.random() * 2) + 2; // 2-3 números
    const numbers: number[] = [];
    let sum = 0;
    
    for (let i = 0; i < numCount; i++) {
      const num = Math.floor(Math.random() * 20) + 5; // 5-25
      numbers.push(num);
      sum += num;
    }
    
    const correctAnswer = Math.round(sum / numCount);
    
    // Asegurar que el resultado sea entero y razonable
    if (correctAnswer > 30 || correctAnswer < 5) {
      return generateSimpleAverageQuestion(isFinal);
    }
    
    const wrongAnswers = generateWrongAnswers(correctAnswer, 3);
    
    return {
      question: `¿Cuál es el promedio de ${numbers.join(', ')}?`,
      options: shuffleArray([correctAnswer, ...wrongAnswers]),
      correct: correctAnswer,
      isFinal
    };
  };

  // Preguntas medias: 3-4 números, resultados < 100
  const generateMediumAverageQuestion = (isFinal: boolean): Question => {
    const numCount = Math.floor(Math.random() * 2) + 3; // 3-4 números
    const numbers: number[] = [];
    let sum = 0;
    
    for (let i = 0; i < numCount; i++) {
      const num = Math.floor(Math.random() * 40) + 10; // 10-50
      numbers.push(num);
      sum += num;
    }
    
    const correctAnswer = Math.round(sum / numCount);
    
    // Asegurar que el resultado sea entero y razonable
    if (correctAnswer > 80 || correctAnswer < 15) {
      return generateMediumAverageQuestion(isFinal);
    }
    
    const wrongAnswers = generateWrongAnswers(correctAnswer, 3);
    
    return {
      question: `¿Cuál es el promedio de ${numbers.join(', ')}?`,
      options: shuffleArray([correctAnswer, ...wrongAnswers]),
      correct: correctAnswer,
      isFinal
    };
  };

  // Preguntas avanzadas: 4-5 números, resultados < 200
  const generateAdvancedAverageQuestion = (isFinal: boolean): Question => {
    const numCount = Math.floor(Math.random() * 2) + 4; // 4-5 números
    const numbers: number[] = [];
    let sum = 0;
    
    for (let i = 0; i < numCount; i++) {
      const num = Math.floor(Math.random() * 60) + 20; // 20-80
      numbers.push(num);
      sum += num;
    }
    
    const correctAnswer = Math.round(sum / numCount);
    
    // Asegurar que el resultado sea entero y razonable
    if (correctAnswer > 150 || correctAnswer < 25) {
      return generateAdvancedAverageQuestion(isFinal);
    }
    
    const wrongAnswers = generateWrongAnswers(correctAnswer, 3);
    
    return {
      question: `¿Cuál es el promedio de ${numbers.join(', ')}?`,
      options: shuffleArray([correctAnswer, ...wrongAnswers]),
      correct: correctAnswer,
      isFinal
    };
  };

  // Generar respuestas incorrectas apropiadas
  const generateWrongAnswers = (correctAnswer: number, count: number): number[] => {
    const wrongAnswers: number[] = [];
    const possibleWrongs = [
      correctAnswer + 1,
      correctAnswer - 1,
      correctAnswer + 2,
      correctAnswer - 2,
      correctAnswer + 3,
      correctAnswer - 3,
      Math.round(correctAnswer * 1.2),
      Math.round(correctAnswer * 0.8)
    ].filter(x => x > 0 && x !== correctAnswer);
    
    // Tomar hasta 'count' respuestas incorrectas únicas
    for (let i = 0; i < Math.min(count, possibleWrongs.length); i++) {
      if (!wrongAnswers.includes(possibleWrongs[i])) {
        wrongAnswers.push(possibleWrongs[i]);
      }
    }
    
    // Si no hay suficientes, agregar más
    while (wrongAnswers.length < count) {
      const extraWrong = correctAnswer + Math.floor(Math.random() * 10) + 1;
      if (!wrongAnswers.includes(extraWrong) && extraWrong > 0) {
        wrongAnswers.push(extraWrong);
      }
    }
    
    return wrongAnswers.slice(0, count);
  };

  // Función para mezclar array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Validar una pregunta
  const validateQuestion = (question: Question): ValidationResult => {
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    // Verificar que el resultado sea entero
    if (!Number.isInteger(question.correct)) {
      errors.push('El resultado debe ser un número entero');
      suggestions.push('Ajustar los números para que la división sea exacta');
    }
    
    // Verificar que el resultado no sea muy grande
    if (question.correct > 200) {
      errors.push('El resultado es muy grande para niños');
      suggestions.push('Usar números más pequeños');
    }
    
    // Verificar que el resultado no sea muy pequeño
    if (question.correct < 5) {
      errors.push('El resultado es muy pequeño');
      suggestions.push('Usar números más grandes');
    }
    
    // Verificar que las opciones sean diferentes
    const uniqueOptions = new Set(question.options);
    if (uniqueOptions.size !== question.options.length) {
      errors.push('Hay opciones duplicadas');
      suggestions.push('Generar opciones únicas');
    }
    
    // Verificar que las opciones sean razonables
    question.options.forEach(option => {
      if (option < 0) {
        errors.push('Hay opciones negativas');
        suggestions.push('Usar solo números positivos');
      }
      if (option > 500) {
        errors.push('Hay opciones muy grandes');
        suggestions.push('Usar números más pequeños');
      }
    });
    
    // Verificar que la pregunta sea clara
    if (question.question.length > 150) {
      errors.push('La pregunta es muy larga');
      suggestions.push('Simplificar el texto');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  };

  // Generar y validar preguntas
  const generateAndValidateQuestions = () => {
    setIsValidating(true);
    const newQuestions: Question[] = [];
    const newValidationResults: ValidationResult[] = [];
    
    for (let i = 0; i < 5; i++) {
      const question = generateChildFriendlyAverageQuestion(i === 4);
      const validation = validateQuestion(question);
      
      newQuestions.push(question);
      newValidationResults.push(validation);
    }
    
    setQuestions(newQuestions);
    setValidationResults(newValidationResults);
    setIsValidating(false);
  };

  // Calcular estadísticas de validación
  const getValidationStats = () => {
    const totalQuestions = validationResults.length;
    const validQuestions = validationResults.filter(r => r.isValid).length;
    const totalErrors = validationResults.reduce((sum, r) => sum + r.errors.length, 0);
    
    return {
      totalQuestions,
      validQuestions,
      invalidQuestions: totalQuestions - validQuestions,
      totalErrors
    };
  };

  const stats = getValidationStats();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔍 Validador de Preguntas Matemáticas</h1>
      <p>Genera y valida preguntas de promedios apropiadas para niños</p>
      
      <button 
        onClick={generateAndValidateQuestions}
        disabled={isValidating}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {isValidating ? 'Generando...' : 'Generar Preguntas'}
      </button>

      {stats.totalQuestions > 0 && (
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '15px', 
          borderRadius: '5px', 
          marginBottom: '20px' 
        }}>
          <h3>📊 Estadísticas de Validación</h3>
          <p>✅ Preguntas válidas: {stats.validQuestions}/{stats.totalQuestions}</p>
          <p>❌ Preguntas con errores: {stats.invalidQuestions}</p>
          <p>⚠️ Total de errores: {stats.totalErrors}</p>
        </div>
      )}

      {questions.map((question, index) => (
        <div key={index} style={{ 
          border: '1px solid #ddd', 
          padding: '15px', 
          marginBottom: '15px', 
          borderRadius: '5px',
          backgroundColor: validationResults[index]?.isValid ? '#e8f5e8' : '#ffe8e8'
        }}>
          <h4>Pregunta {index + 1} {question.isFinal ? '(FINAL)' : ''}</h4>
          <p><strong>Pregunta:</strong> {question.question}</p>
          <p><strong>Opciones:</strong> {question.options.join(', ')}</p>
          <p><strong>Respuesta correcta:</strong> {question.correct}</p>
          
          {validationResults[index] && (
            <div>
              {validationResults[index].isValid ? (
                <p style={{ color: 'green' }}>✅ Válida</p>
              ) : (
                <div>
                  <p style={{ color: 'red' }}>❌ Errores encontrados:</p>
                  <ul>
                    {validationResults[index].errors.map((error, i) => (
                      <li key={i} style={{ color: 'red' }}>{error}</li>
                    ))}
                  </ul>
                  <p style={{ color: 'blue' }}>💡 Sugerencias:</p>
                  <ul>
                    {validationResults[index].suggestions.map((suggestion, i) => (
                      <li key={i} style={{ color: 'blue' }}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionValidator; 