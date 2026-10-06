import { fireEvent, render } from '@testing-library/react'
import UploadImgBtn from './UploadImgBtn'

const addAlert = jest.fn()
jest.mock('hooks/useAlert', () => ({ __esModule: true, default: () => ({ alertArr: [], addAlert }) }))

function setup(maxSize = 100) {
    const onFile = jest.fn()
    const { container } = render(
        <UploadImgBtn name="img" id="img" btnTxt="Upload" maxSize={maxSize} onFile={onFile} />
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    return { input, onFile, container }
}

beforeEach(() => addAlert.mockClear())

describe('UploadImgBtn', () => {
    it('ignores a change event with an empty FileList', () => {
        const { input, onFile } = setup()
        expect(() => fireEvent.change(input, { target: { files: [] } })).not.toThrow()
        expect(onFile).not.toHaveBeenCalled()
        expect(addAlert).not.toHaveBeenCalled()
    })

    it('rejects a file over the size limit with an alert', () => {
        const { input, onFile } = setup(10)
        const file = new File(['x'.repeat(11)], 'big.png', { type: 'image/png' })
        fireEvent.change(input, { target: { files: [file] } })
        expect(onFile).not.toHaveBeenCalled()
        expect(addAlert).toHaveBeenCalledWith('Failure', 'That file is larger than the input limit')
    })

    it('passes a file within the limit to the callback', () => {
        const { input, onFile } = setup(10)
        const file = new File(['x'], 'small.png', { type: 'image/png' })
        fireEvent.change(input, { target: { files: [file] } })
        expect(onFile).toHaveBeenCalledWith(file)
    })

    it('does not render "undefined" as a class when btnClass is omitted', () => {
        const { container } = setup()
        expect(container.querySelector('button')?.className).not.toContain('undefined')
    })
})
