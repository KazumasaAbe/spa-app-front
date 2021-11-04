import { mount } from '@vue/test-utils'
import sample from '@/pages/sample'

describe('HelloWorld', () => {
  test('display Hello World', () => {
    const wrapper = mount(sample)
    expect(wrapper.text()).toBe('Hello World')
  })
})

describe('two plus two is four', () => {
  test('tow plus', () => {
    expect(2 + 2).toBe(4)
  })
})
