import os from 'node:os'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Adapters that have a real IPv4 address but are NOT reachable from another
// device on the wifi - VM host-only networks, WSL, Hyper-V switches, VPN and
// Bluetooth links. Vite's own "Network:" list prints all of these with no way
// to tell them apart, which makes it easy to copy a URL that can never work
// from a phone (e.g. this machine's VMware VMnet1/VMnet8 192.168.157.1 /
// 192.168.60.1, which respond locally but are on subnets no phone is on).
const VIRTUAL_ADAPTER_RE = /vmware|virtualbox|vbox|vethernet|wsl|hyper-v|loopback|bluetooth|vpn|tailscale|zerotier|docker/i

function physicalLanAddresses() {
    return Object.entries(os.networkInterfaces()).flatMap(([name, addrs]) => {
        if (VIRTUAL_ADAPTER_RE.test(name)) return []
        return (addrs ?? [])
            .filter(
                (a) =>
                    a.family === 'IPv4' &&
                    !a.internal &&
                    // 169.254.x.x = link-local, i.e. the adapter never got a
                    // real DHCP lease (disconnected NIC), so it routes nowhere.
                    !a.address.startsWith('169.254.'),
            )
            .map((a) => ({ name, address: a.address }))
    })
}

// Prints the LAN URL(s) that a phone on the same wifi can actually open,
// after Vite's own banner. The address is DHCP-assigned and changes when the
// lease renews, so this re-reads it on every start rather than being written
// down anywhere.
function printPhoneTestingUrl() {
    return {
        name: 'print-phone-testing-url',
        apply: 'serve',
        configureServer(server) {
            const originalPrint = server.printUrls
            server.printUrls = () => {
                originalPrint()
                const port = server.config.server.port ?? 5173
                const found = physicalLanAddresses()
                if (found.length === 0) {
                    console.log('\n  [33m➜[0m  On your phone: no wifi/ethernet address found - is this machine online?\n')
                    return
                }
                console.log('')
                for (const { name, address } of found) {
                    console.log(`  [32m➜[0m  [1mOn your phone[0m (${name}): [36mhttp://${address}:${port}/[0m`)
                }
                console.log('')
            }
        },
    }
}

export default defineConfig({
    plugins: [react(), tailwindcss(), printPhoneTestingUrl()],
    server: {
        // Bind to all network interfaces (not just localhost) so a phone/tablet
        // on the same wifi can reach the dev server via the machine's LAN IP -
        // "npm run dev" alone only listens on localhost, which a phone can't
        // resolve to this machine at all.
        host: true,
    },
})
