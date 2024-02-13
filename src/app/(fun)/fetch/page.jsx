import React from 'react'
import { Container } from '@/components/Container'

function Fetch() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="m-8 flex h-screen max-h-[80vh] items-center justify-center overflow-clip rounded-lg bg-[#0d1117] text-white">
        <div className="font-mono my-10 grid max-h-[90vh] w-3/4 grid-cols-2 gap-4 lg:w-3/4">
          <pre className="col-span-2 rounded-lg bg-[#161b22] p-4">
            <span className="text-green-500">$</span>&nbsp;neofetch
          </pre>
          <div
            style={{
              backgroundImage:
                'url(https://wallpapercave.com/wp/wp6929104.png)',
            }}
            className="h-full w-full rounded-lg bg-cover bg-center"
          ></div>
          <div className="rounded-lg bg-[#161b22] p-4 text-blue-300">
            <pre className="mb-1 font-bold">kaizen@ikigai</pre>
            <pre className="mb-1">———————</pre>
            <pre>OS ➜ Arch Linux x86_64</pre>
            <pre>Kernel ➜ zen</pre>
            <pre>Boot ➜ limine</pre>
            <pre>Greeter ➜ regreet (greetd)</pre>
            <pre className="mb-1">———————</pre>
            <pre>CPU ➜ AMD Ryzen 7 5800X (16) @ 4.85 GHz</pre>
            <pre>GPU ➜ AMD Radeon RX 6700 XT</pre>
            <pre>RAM ➜ 128GB Crucial Ballistix 3200 MHz DDR4</pre>
            <pre>MON ➜ MSI Optix G27C4 (1920x1080) 165 Hz</pre>
            <pre className="mb-1">———————</pre>
            <pre>WM ➜ sway</pre>
            <pre>Bar ➜ waybar</pre>
            <pre>Shell ➜ zsh</pre>
            <pre>Terminal ➜ alacritty</pre>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Fetch
