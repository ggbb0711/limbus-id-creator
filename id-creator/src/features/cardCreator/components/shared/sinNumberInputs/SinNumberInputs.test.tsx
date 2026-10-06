import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { SIN_AFFINITIES, SinRecord, createSinRecord } from 'features/cardCreator/constants'
import { useNumberRegister } from 'features/cardCreator/hooks/useNumberRegister'
import SinNumberInputs, { SinValueList } from './SinNumberInputs'

interface Form { cost: SinRecord }

function Harness() {
    const form = useForm<Form>({ defaultValues: { cost: { ...createSinRecord(0), wrath: 3 } } })
    const registerNumber = useNumberRegister(form)
    return <SinNumberInputs<Form> field="cost" registerNumber={registerNumber} idSuffix="x" colorFor={(key) => key === 'wrath' ? 'red' : undefined}/>
}

describe('SinNumberInputs', () => {
    it('renders one input per sin with unique ids', () => {
        const { container } = render(<Harness/>)
        const ids = Array.from(container.querySelectorAll('input')).map(input => input.id)
        expect(ids).toEqual(['wrath_x', 'lust_x', 'sloth_x', 'gluttony_x', 'gloom_x', 'pride_x', 'envy_x'])
    })

    it('uses capitalised icon file names', () => {
        render(<Harness/>)
        SIN_AFFINITIES.forEach(sin => {
            expect(screen.getByAltText(`${sin}-input-icon`)).toHaveAttribute('src', `/Images/sin-affinity/affinity_${sin}_big.webp`)
        })
    })

    it('binds each input to its record key and applies colours', () => {
        const { container } = render(<Harness/>)
        const wrath = container.querySelector('#wrath_x') as HTMLInputElement
        expect(wrath.value).toBe('3')
        expect(wrath.style.color).toBe('red')
        expect((container.querySelector('#lust_x') as HTMLInputElement).style.color).toBe('')
    })
})

describe('SinValueList', () => {
    it('renders every sin in order with its value', () => {
        const values = { ...createSinRecord(1), envy: 9 }
        render(<ul><SinValueList values={values} render={(sin, value) => <li>{sin}:{value}</li>}/></ul>)
        expect(screen.getAllByRole('listitem').map(item => item.textContent)).toEqual(
            ['Wrath:1', 'Lust:1', 'Sloth:1', 'Gluttony:1', 'Gloom:1', 'Pride:1', 'Envy:9'])
    })
})
