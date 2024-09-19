'use client'
import Image from "next/image"
import {useState} from 'react'
import {Box, Button, Stack, TextField, Typography} from '@mui/material'
import {styled} from '@mui/material/styles'

const Message = styled(Box)(({theme, role}) => ({
  backgroundColor: role === 'assistant' ? '#406D80' : '#DAA49A', // Teal for assistant, muted coral for user
  color: 'white',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  maxWidth: '80%',
  wordWrap: 'break-word',
  hyphens: 'auto',
  transition: 'all 0.3s ease-out',
}))

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      // content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`,
      content: `Welcome to the Coffee Chat Corner! How can I assist you with coffee recommendations today?`,
    },
  ])

  const[message, setMessage] = useState('')

  const sendMessage = async() => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content: ''},
    ])
    
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream:true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'linear-gradient(to right, #F4F4F4, #E8E8E8)', // Soft grey gradient
        color: '#2C3E50', // Dark blue-grey text for contrast
      }}
    >
      <Stack
        sx={{
          width: 600,
          height: 700,
          backgroundColor: '#FFF8F0', // Soft cream background
          borderRadius: 2,
          boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
          padding: 3,
          spacing: 2,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ alignSelf: 'center', fontWeight: 'bold', color: '#2C3E50' }}>
          Barista Bot
        </Typography>
        <Stack
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            my: 2,
            p: 1,
          }}
        >
          {messages.map((message, index) => (
            <Message
              key={index}
              role={message.role}
              sx={{
                alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end',
                mb: 1,
              }}
            >
              {message.content}
            </Message>
          ))}
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            pt: 2,
          }}
        >
          <TextField
            fullWidth
            label="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              input: { color: '#2C3E50' }, // Dark blue-grey for text
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#B2B1B9', // Soft grey to match the background
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              backgroundColor: '#406D80', // Teal color button
              '&:hover': {
                backgroundColor: '#355D66', // Darker teal on hover
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

/*  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
            key={index}
            display="flex"
            justifyContent={
              message.role === 'assistant' ? 'flex-start' : 'flex-end'
            }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  )
} */
