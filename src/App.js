
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  VStack,
  Input,
  SkeletonText,
  Text,
  HStack,
} from '@chakra-ui/react'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'

const center = { lat: 48.8584, lng: 2.2945 }

function App() {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAolXVBph__8LXk-JukgnxDUI4LPDQAsxQ',
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }


  return (
    
      <Flex 
      position='relative'
      flexDirection='row'
      alignItems='center'
      h='100vh'
      w='100vw'
      bg='#E5E5E5'
      >
      <Box className='media' position='absolute' left={800} top={150} h='70%' w='30%'>
        
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box m={40} className='media'>
        <HStack ml={-10} mb={50}>
          <VStack  spacing={2} justifyContent='space-between'>
            <Box m={10}>
              <Box  flexGrow={1}>
                <Text as='b'>Origin</Text>
                <Autocomplete>
                  <Input w={200} rounded={2}  bg='white' type='text' placeholder='Origin' ref={originRef} />
                </Autocomplete>
              </Box>
              <Box  flexGrow={1}>
                <Text as='b'>Destination</Text>
                <Autocomplete>
                  <Input w={200} rounded={2}   bg='white' type='text' placeholder='Destination' ref={destiantionRef}/>
                </Autocomplete>
              </Box> 
            </Box>
          </VStack>
          <ButtonGroup >
            <Button border="20px" rounded={20} colorScheme="blue" type='submit' onClick={calculateRoute}>
              Calculate 
            </Button> 
          </ButtonGroup>
        </HStack>
        <Box rounded={2} width={400} p={4} bg='white' flexGrow={1}>
              <Text as='b'>Distance <Text ml={40} color="blue" fontSize="30px" as='b'>{distance} </Text></Text>
          </Box>
      </Box>
      </Flex>
  )
}

export default App
