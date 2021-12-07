/* eslint-disable jsx-a11y/media-has-caption */

type Props = {
  audioURL: string | undefined;
};

export default function Waveform({ audioURL }: Props) {
  if (!audioURL) return null;

  return <audio id="audio" style={{ width: "100%" }} controls src={audioURL}></audio>;
}
