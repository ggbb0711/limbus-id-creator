import { fireEvent, render } from '@testing-library/react'
import UploadImgBtn from './UploadImgBtn'

const addAlert = jest.fn()
jest.mock('hooks/useAlert', () => ({ __esModule: true, default: () => ({ alertArr: [], addAlert }) }))

function setup(maxSize = 100) {
    const onFileInputChange = jest.fn()
    const { container } = render(
        <UploadImgBtn name="img" id="img" btnTxt="Upload" maxSize={maxSize} onFileInputChange={onFileInputChange} />
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    return { input, onFileInputChange, container }
}

beforeEach(() => addAlert.mockClear())

describe('UploadImgBtn', () => {
    it('ignores a change event with an empty FileList', () => {
        const { input, onFileInputChange } = setup()
        expect(() => fireEvent.change(input, { target: { files: [] } })).not.toThrow()
        expect(onFileInputChange).not.toHaveBeenCalled()
        expect(addAlert).not.toHaveBeenCalled()
    })

    it('rejects a file over the size limit with an alert', () => {
        const { input, onFileInputChange } = setup(10)
        const file = new File(['x'.repeat(11)], 'big.png', { type: 'image/png' })
        fireEvent.change(input, { target: { files: [file] } })
        expect(onFileInputChange).not.toHaveBeenCalled()
        expect(addAlert).toHaveBeenCalledWith('Failure', 'That file is larger than the input limit')
    })

    it('passes a file within the limit to the callback', () => {
        const { input, onFileInputChange } = setup(10)
        const file = new File(['x'], 'small.png', { type: 'image/png' })
        fireEvent.change(input, { target: { files: [file] } })
        expect(onFileInputChange).toHaveBeenCalledTimes(1)
    })

    it('does not render "undefined" as a class when btnClass is omitted', () => {
        const { container } = setup()
        expect(container.querySelector('button')?.className).not.toContain('undefined')
    })
})
