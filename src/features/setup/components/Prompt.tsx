import s from '../setup.module.css'

/** The owner's starship prompt followed by a command. */
export function Prompt({ command }: { command: string }) {
  return (
    <p className={s.dkPrompt}>
      <b>kaizen</b>@<i>ikigai</i> <em>~/dotfiles</em> <span>❯</span> {command}
    </p>
  )
}
