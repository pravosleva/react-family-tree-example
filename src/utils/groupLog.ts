/* eslint-disable @typescript-eslint/no-explicit-any */
type TProps = {
  namespace: string;
  items: any[];
}

export const groupLog = ({ namespace, items }: TProps): void => {
  if (items.length > 0) { 
    console.groupCollapsed(namespace)
      switch (true) {
        case Array.isArray(items):
          for (const msg of items) console.log(msg)
          break
        default:
          console.log(items)
          break
      }
    console.groupEnd()
  } else console.log(namespace)
}
