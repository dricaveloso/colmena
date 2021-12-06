/* eslint-disable jsx-a11y/media-has-caption */

type Props = {
  audioURL: string;
};

export default function Waveform({ audioURL }: Props) {
  return <audio id="audio" controls src={audioURL}></audio>;
}
