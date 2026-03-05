import type { LayoutConfig } from 'golden-layout'

export const defaultLayout: LayoutConfig = {
  root: {
    type: 'row',
    content: [
      {
        type: 'component',
        componentType: 'FileTree',
        title: 'Files',
        width: 15,
      },
      {
        type: 'component',
        componentType: 'Editor',
        title: 'Editor',
        width: 40,
      },
      {
        type: 'column',
        width: 45,
        content: [
          {
            type: 'component',
            componentType: 'AST',
            title: 'AST',
          },
          {
            type: 'stack',
            content: [
              {
                type: 'component',
                componentType: 'IL',
                title: 'IL',
              },
              {
                type: 'component',
                componentType: 'Output',
                title: 'Output',
              },
            ],
          },
        ],
      },
    ],
  },
}
