'use client';

import React, { useState, useEffect } from 'react';
import * as ChakraUI from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Anthropic from '@anthropic-ai/sdk';

// const client = new Anthropic({
//   apiKey: '',
//   dangerouslyAllowBrowser: true
// });

const Honey = ({ onVerify }) => {
  const [CaptchaComponent, setCaptchaComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCaptcha = async () => {
    try {
      console.log("Fetching captcha...");
      // const message = await client.messages.create({
      //   max_tokens: 1024,
      //   messages: [{ 
      //     role: 'user', 
      //     content: "Fetch a captcha component using Chakra UI in a structured format. The component should be a valid React component string. Don't put any other text in the response, it should be purely the react component string (not even JSX opening). Before each chakra component, append ChakraUI. ie ChakraUI.Button. The component should be a react function." 
      //   }],
      //   model: 'claude-3-5-sonnet-20241022',
      // });
      let data = `function Captcha() {
  const [captchaValue, setCaptchaValue] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(captcha);
  };

  const handleSubmit = () => {
    setIsValid(userInput === captchaValue);
  };

  return (
    <ChakraUI.VStack spacing={4} align="center" w="300px">
      <ChakraUI.Box
        bg="gray.100"
        p={4}
        borderRadius="md"
        fontFamily="monospace"
        fontSize="xl"
        letterSpacing="wide"
        textDecoration="line-through"
        transform="skew(-10deg)"
      >
        {captchaValue}
      </ChakraUI.Box>
      
      <ChakraUI.Input
        placeholder="Enter captcha"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      
      <ChakraUI.HStack spacing={4}>
        <ChakraUI.Button onClick={handleSubmit} colorScheme="blue">
          Verify
        </ChakraUI.Button>
        
        <ChakraUI.Button onClick={generateCaptcha} colorScheme="gray">
          Refresh
        </ChakraUI.Button>
      </ChakraUI.HStack>
      
      {isValid !== null && (
        <ChakraUI.Text
          color={isValid ? "green.500" : "red.500"}
          fontWeight="bold"
        >
          {isValid ? "Correct!" : "Incorrect, try again"}
        </ChakraUI.Text>
      )}
    </ChakraUI.VStack>
  );
}`
      // const data = message.content[0].text;
      // console.log("Received component:", data);

      const comp = new Function(
        'React', 
        'useState', 
        'useEffect', 
        'useRef',
        'useCallback',
        'useMemo',
        `
          return ${data};
        `
      );
  
      setCaptchaComponent(() => comp);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  if (loading) {
    return <ChakraUI.Center><ChakraUI.Spinner /></ChakraUI.Center>;
  }

  return CaptchaComponent ? (
    <ChakraUI.Card>
      <ChakraUI.CardBody>
        <ChakraUI.Box p={4}>
          <CaptchaComponent onVerify={onVerify} />
        </ChakraUI.Box>
      </ChakraUI.CardBody>
    </ChakraUI.Card>
  ) : (
    <ChakraUI.Center>
      <ChakraUI.Text>No captcha component available</ChakraUI.Text>
    </ChakraUI.Center>
  );
};

export default Honey;