import {
	useEditor,
	EditorContent,
	type Editor as EditorType,
} from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import {
	Bold,
	Strikethrough,
	Italic,
	List,
	ListOrdered,
	Heading1,
	LucideIcon,
	Heading2,
	Heading3,
	Quote,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	Heading,
} from 'lucide-react';
import { Toggle } from './ui/toggle';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { forwardRef, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface HeadingCheckboxProps {
	level: 1 | 2 | 3;
	Icon: LucideIcon;
	editor: EditorType;
	setActive: (icon?: LucideIcon) => void;
}

const HeadingCheckbox = ({
	level,
	Icon,
	editor,
	setActive,
}: HeadingCheckboxProps) => {
	return (
		<DropdownMenuCheckboxItem
			className='w-full flex items-center justify-between'
			checked={editor.isActive('heading', { level })}
			onCheckedChange={() => {
				editor.chain().focus().toggleHeading({ level }).run();
				if (editor.isActive('heading', { level })) {
					setActive(Icon);
				}

				if (!editor.isActive('heading')) {
					setActive(undefined);
				}
			}}>
			<Icon className='h-4 w-4' />
			<span>Heading {level}</span>
		</DropdownMenuCheckboxItem>
	);
};

export function DropdownMenuCheckboxes({ editor }: { editor: EditorType }) {
	const [Active, setActive] = useState<LucideIcon>();

	const options = useMemo<HeadingCheckboxProps[]>(() => {
		return [
			{ editor, Icon: Heading1, level: 1, setActive },
			{ editor, Icon: Heading2, level: 2, setActive },
			{ editor, Icon: Heading3, level: 3, setActive },
		];
	}, [editor]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Toggle
					size={'sm'}
					className={editor.isActive('heading') ? 'bg-accent' : ''}>
					{Active ? (
						<Active className='h-4 w-4' />
					) : (
						<Heading className='h-4 w-4' />
					)}
				</Toggle>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-40'>
				{options.map((props, idx) => (
					<HeadingCheckbox {...props} key={idx} />
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

interface TextAlignCheckboxProps {
	align: 'left' | 'center' | 'right' | 'justify';
	Icon: LucideIcon;
	editor: EditorType;
	setActive: (icon?: LucideIcon) => void;
}

const TextAlignCheckbox = ({
	align,
	Icon,
	editor,
	setActive,
}: TextAlignCheckboxProps) => {
	return (
		<DropdownMenuCheckboxItem
			className='w-full flex items-center justify-between'
			checked={editor.isActive({ textAlign: align })}
			onCheckedChange={() => {
				editor.chain().focus().setTextAlign(align).run();
				if (editor.isActive({ textAlign: align })) {
					setActive(Icon);
				}

				if (!editor.isActive({ textAlign: align })) {
					setActive(undefined);
				}
			}}>
			<Icon className='h-4 w-4' />
			<span>{align.charAt(0).toUpperCase() + align.slice(1)}</span>
		</DropdownMenuCheckboxItem>
	);
};

export function DropdownMenuAlignments({ editor }: { editor: EditorType }) {
	const [Active, setActive] = useState<LucideIcon>();

	const options = useMemo<TextAlignCheckboxProps[]>(() => {
		return [
			{ editor, Icon: AlignLeft, align: 'left', setActive },
			{ editor, Icon: AlignCenter, align: 'center', setActive },
			{ editor, Icon: AlignRight, align: 'right', setActive },
			{ editor, Icon: AlignJustify, align: 'justify', setActive },
		];
	}, [editor]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Toggle
					size={'sm'}
					className={
						editor.isActive({ textAlign: 'left' }) ||
						editor.isActive({ textAlign: 'center' }) ||
						editor.isActive({ textAlign: 'right' }) ||
						editor.isActive({ textAlign: 'justify' })
							? 'bg-accent'
							: ''
					}>
					{Active ? (
						<Active className='h-4 w-4' />
					) : (
						<AlignLeft className='h-4 w-4' />
					)}
				</Toggle>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-40'>
				{options.map((props, idx) => (
					<TextAlignCheckbox {...props} key={`${idx}`} />
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

interface EditorProps {
	name: string;
	disabled?: boolean;
	value: string;
	onChange: (value: { text: string; html: string }) => void;
}

const Editor = forwardRef<HTMLDivElement, EditorProps>(
	({ disabled, name, value, onChange }, ref) => {
		const editor = useEditor({
			editorProps: {
				attributes: {
					class:
						'h-[25vh] !fade-in !duration-500 fade-in w-full rounded-b-md bg-background border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto',
				},
			},
			extensions: [
				StarterKit.configure({
					orderedList: {
						HTMLAttributes: {
							class: 'list-decimal pl-4',
						},
					},
					bulletList: {
						HTMLAttributes: {
							class: 'list-disc pl-4',
						},
					},
					blockquote: { HTMLAttributes: { class: 'pl-4 border-l-[2px]' } },
				}),
				TextAlign.configure({
					types: ['heading', 'paragraph'],
				}),
			],
			content: value,
			onUpdate({ editor }) {
				onChange({
					text: editor.getText(),
					html: DOMPurify.sanitize(editor.getHTML()),
				});
			},
		});

		if (!editor) return null;

		return (
			<>
				<EditorToolbar editor={editor} />
				<EditorContent
					ref={ref}
					disabled={disabled}
					name={name}
					editor={editor}
					className='!m-0'
				/>
			</>
		);
	}
);

const EditorToolbar = ({ editor }: { editor: EditorType }) => {
	return (
		<div className='border border-input rounded-t-md flex-wrap rounded-b-none border-b-0 p-1 flex flex-row items-center gap-1 bg-background'>
			<Toggle
				size='sm'
				pressed={editor.isActive('bold')}
				onPressedChange={() => editor.chain().focus().toggleBold().run()}>
				<Bold className='h-4 w-4' />
			</Toggle>
			<Toggle
				size='sm'
				pressed={editor.isActive('italic')}
				onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
				<Italic className='h-4 w-4' />
			</Toggle>
			<Toggle
				size='sm'
				pressed={editor.isActive('strike')}
				onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
				<Strikethrough className='h-4 w-4' />
			</Toggle>
			<Toggle
				size='sm'
				pressed={editor.isActive('blockquote')}
				onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
				<Quote className='h-4 w-4' />
			</Toggle>
			<Toggle
				size='sm'
				pressed={editor.isActive('bulletList')}
				onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
				<List className='h-4 w-4' />
			</Toggle>
			<Toggle
				size='sm'
				pressed={editor.isActive('orderedList')}
				onPressedChange={() =>
					editor.chain().focus().toggleOrderedList().run()
				}>
				<ListOrdered className='h-4 w-4' />
			</Toggle>
			<DropdownMenuCheckboxes editor={editor} />
			<DropdownMenuAlignments editor={editor} />
		</div>
	);
};

Editor.displayName = 'Editor';

export default Editor;
