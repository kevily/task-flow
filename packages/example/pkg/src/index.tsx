import './scss.scss'

const obj = {
    a: ''
} satisfies Record<string, any>
export function Home() {
    console.log('obj', obj)
    return <div>home</div>
}
