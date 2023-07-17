import './scss.scss'

export class Test {
    add() {
        console.log('add', 2 ?? 3)
        return [1, 2, 3].map(v => v * 2)
    }
}
