import {renderVideo} from '@revideo/renderer';

process.env.FFMPEG_PATH = 'ffmpeg';
process.env.FFPROBE_PATH = 'ffprobe';

async function render() {
  console.log('Rendering video...');

  // This is the main function that renders the video
  const file = await renderVideo({
    projectFile: './src/project.tsx',
    settings: {logProgress: true},
  });

  console.log(`Rendered video to ${file}`);
}

render();
