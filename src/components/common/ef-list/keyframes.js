let slideLeftIn= [
    {transform:'translateX(-300%)'},
    { transform: 'translateX(0)' }
  ]
let slideLeftOut=[
  { transform: 'translateX(0)' },
  {transform:'translateX(100%)'},
]
let slideDownIn=[
  {transform:'translateY(-300%)'},
  { transform: 'translateX(0)' }
]

let slideDownOut=[
  {transform:'translateY(0)'},
  { transform: 'translateY(100%)' }
]

export default {
  slideLeftIn,
  slideLeftOut,
  slideDownIn,
  slideDownOut
}
