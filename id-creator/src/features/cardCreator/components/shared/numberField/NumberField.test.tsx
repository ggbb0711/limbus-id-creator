import { fireEvent, render, screen } from '@testing-library/react'
import { useForm, useWatch } from 'react-hook-form'
import { useNumberRegister } from 'features/cardCreator/hooks/useNumberRegister'
import NumberField from './NumberField'

interface Form { power: number }

function Harness({ error }: { error?: string }) {
    const form = useForm<Form>({ defaultValues: { power: 5 } })
    const registerNumber = useNumberRegister(form)
    const power = useWatch({ control: form.control, name: 'power' })
    const errors = error ? { power: { type: 'manual', message: error } } : {}
    return <>
        <NumberField<Form> name="power" label="Power:" registerNumber={registerNumber} idSuffix="abc" errors={errors}/>
        <output>{typeof power}:{power}</output>
    </>
}

describe('NumberField', () => {
    it('links the label to a suffixed id', () => {
        render(<Harness/>)
        expect(screen.getByLabelText('Power:')).toHaveAttribute('id', 'power_abc')
    })

    it('stores numbers as numbers', () => {
        render(<Harness/>)
        fireEvent.change(screen.getByLabelText('Power:'), { target: { value: '12' } })
        expect(screen.getByRole('status')).toHaveTextContent('number:12')
    })

    it('resets an empty value to 0 on blur', async () => {
        render(<Harness/>)
        const input = screen.getByLabelText('Power:')
        fireEvent.change(input, { target: { value: '' } })
        fireEvent.blur(input)
        expect(await screen.findByDisplayValue('0')).toBe(input)
    })

    it('shows the error message', () => {
        render(<Harness error="Too high"/>)
        expect(screen.getByText('Too high')).toBeInTheDocument()
        expect(screen.getByLabelText('Power:')).toHaveClass('input-error')
    })
})
