import {makeProject, Random, tween} from '@revideo/core';

import {Audio, Img, makeScene2D, Txt, Video, Rect, Gradient} from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';
import { myPhotos } from './photoList';


const get_random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {
  
  const introVideo = createRef<Video>();
  const shutterAudio = createRef<Audio>();
  const bgAudio = createRef<Audio>();
  
  // Nombres de tus archivos en public/fotos/
  const fotos = ['Civil01.avif', 'Civil02.avif', 'Civil03.avif']; 
  const duracionPorFoto = 3; // segundos

view.add(
    <Audio 
      ref={bgAudio} 
      src="/Background.mp3" 
      play={true} 
      volume={0.4} // Lower volume so it's "background"
      loop={true} 
      time={25}
    />
  );

  view.add(
  <Audio src="/shutter.mp3" play={false} volume={0.7} ref={shutterAudio}/>
  );  
  view.add(
    <Rect
      width={'100%'}
      height={'100%'}
      fill={
        new Gradient({
          fromX: -540, // Left
          fromY: -960, // Top
          toX: 540,    // Right
          toY: 960,    // Bottom
          stops: [
            { offset: 0, color: '#1b1b1b' }, // Light grey/warm tone
            { offset: 1, color: '#303030' }, // Deeper grey
          ],
        })
      }
    />
  );
  // 1. Parte del Intro: Armando el rollo
  view.add(
    <>
        <Video
      ref={introVideo}
      src="/intro.mp4"
      size={['100%', '100%']}
      play={true} 
      volume={0}
      width={1920}  
      height={1080}
    />
    </>
  );

  yield introVideo().play();

  // Esperamos a que termine el video de intro (ajusta el tiempo según tu clip)
  yield* waitFor(introVideo().getDuration()-2.5); // Espera 5 segundos (o el tiempo que dure tu intro)

  yield introVideo().pause(); 

  yield* waitFor(1); // Pequeña pausa antes de empezar con las fotos
  // 2. Loop de Fotos Analógicas
  for (const foto of myPhotos) {
    // const fotoRef = createRef<Img>();
    const contenedorRef = createRef<Rect>();
    shutterAudio().save();
    yield shutterAudio().play(); // Reproducir el sonido del obturador cada vez que se muestra una foto
    
    view.add(
      <>

        
        {/* Marco Blanco y Foto */}
     <Rect
      ref={contenedorRef}
      width={"95%"} // Ajusta el tamaño total del "papel"
      fill={'white'}
      padding={[40, 40, 40, 40]} // [Arriba, Derecha, Abajo, Izquierda] - Más abajo para estilo Polaroid
      shadowBlur={40}
      shadowColor={'rgba(0,0,0,0.3)'}
      rotation={get_random(-5, 5)}
      layout // Importante: Esto hace que respete el padding para los hijos
    >
      {/* La imagen ahora es hija del Rect y respetará el espacio interno */}
      <Img
        src={`/photos/${foto}`}
        width={'100%'} // Ocupa el 100% del espacio disponible tras el padding
        radius={4}     // Un pequeño redondeado sutil en las esquinas de la foto
      />
    </Rect>
      </>
    );

    yield* chain(
      all(contenedorRef().scale(1.05, duracionPorFoto))
    );

    // yield* waitFor(1); 

    // Animación: Zoom sutil (de 100% a 105%) durante los 3 segundos
    // yield* fotoRef().scale(1.05, duracionPorFoto);
    // Limpiamos la foto antes de la siguiente
    shutterAudio().restore();
    contenedorRef().remove();
  }

  yield* tween(3, value => {
  bgAudio().setVolume(0.4 * (1 - value));
});
});

/**
 * The final revideo project
 */
export default makeProject({
  scenes: [scene],
  settings: {
    // Example settings:
    shared: {
      size: {x: 1080, y: 1920},
    },
     rendering: {
      exporter: {
        name: '@revideo/core/ffmpeg',
        options: {
          format: 'mp4'
        }
      }
    }
  },
});
