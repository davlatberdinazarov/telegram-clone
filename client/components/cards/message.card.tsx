import { useCurrentContact } from "@/hooks/use-current";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import { FC } from "react";
import { format } from "date-fns";
import { Check, CheckCheck, Edit2, Trash } from "lucide-react";
import { CONST } from "@/lib/constants";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '../ui/context-menu'

interface Props {
  message: IMessage;
  onReaction: (reaction: string, messageId: string) => Promise<void>
 	onDeleteMessage: (messageId: string) => Promise<void>
}

const MessageCard: FC<Props> = ({ message, onReaction, onDeleteMessage }) => {
  const { currentContact, setEditedMessage } = useCurrentContact()

  const reactions = ['👍', '😂', '❤️', '😍', '👎']

  return (
<ContextMenu>
			<ContextMenuTrigger asChild>
				<div
					className={cn(
						'm-2.5 font-medium text-xs flex',
						message.receiver._id === currentContact?._id ? 'justify-start' : 'justify-end'
					)}
				>
					<div
						className={cn(
							'relative inline p-2 pl-2.5 pr-12 max-w-full',
							message.receiver._id === currentContact?._id ? 'bg-primary' : 'bg-secondary'
						)}
					>
						<p className='text-sm text-white'>{message.text}</p>
						<div className='right-1 bottom-0 absolute opacity-60 text-[9px] flex gap-[3px]'>
							<p>{format(message.updatedAt, 'hh:mm')}</p>
							<div className='self-end'>
								{message.receiver._id === currentContact?._id &&
									(message.status === CONST.READ ? <CheckCheck size={12} /> : <Check size={12} />)}
							</div>
						</div>

						<span className='absolute -right-2 -bottom-2'>{message.reaction}</span>
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className='w-56 p-0 mb-10'>
				<ContextMenuItem className='grid grid-cols-5'>
					{reactions.map(reaction => (
						<div
							key={reaction}
							className={cn(
								'text-xl cursor-pointer p-1 hover:bg-primary/50 transition-all',
								message.reaction === reaction && 'bg-primary/50'
							)}
							onClick={() => onReaction(reaction, message._id)}
						>
							{reaction}
						</div>
					))}
				</ContextMenuItem>
				{message.sender._id !== currentContact?._id && (
					<>
						<ContextMenuSeparator />
						<ContextMenuItem className='cursor-pointer' onClick={() => setEditedMessage(message)}>
							<Edit2 size={14} className='mr-2' />
							<span>Edit</span>
						</ContextMenuItem>
						<ContextMenuItem className='cursor-pointer' onClick={() => onDeleteMessage(message._id)}>
							<Trash size={14} className='mr-2' />
							<span>Delete</span>
						</ContextMenuItem>
					</>
				)}
			</ContextMenuContent>
		</ContextMenu>
  );
};

export default MessageCard;
