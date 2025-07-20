'use client';

import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@/app/_components/AuthContext';
import { db } from '@/app/Configs/firebaseConfig';
import { Button } from '@/components/ui/button';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { RefreshCcw, Trash2, Video, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function ProjectList() {
  const [projectList, setProjectList] = useState([]);
  const { user } = useAuthContext();

  const GetUserProjects = async (uid) => {
    try {
      const videoQuery = query(collection(db, 'videos'), where('uid', '==', uid));
      const videoSnapshot = await getDocs(videoQuery);
      const videos = videoSnapshot.docs.map(doc => ({ id: doc.id, type: 'video', ...doc.data() }));

      const imageQuery = query(collection(db, 'images'), where('uid', '==', uid));
      const imageSnapshot = await getDocs(imageQuery);
      const images = imageSnapshot.docs.map(doc => ({ id: doc.id, type: 'image', ...doc.data() }));

      const allProjects = [...videos, ...images];
      allProjects.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      setProjectList(allProjects);
    } catch (error) {
      console.error('Failed to fetch user projects:', error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      GetUserProjects(user.uid);
    }
  }, [user]);

  const handleDelete = async (e, projectId, projectType) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure?")) {
      try {
        const collectionName = projectType === 'video' ? 'videos' : 'images';
        await deleteDoc(doc(db, collectionName, projectId));
        setProjectList(currentList => currentList.filter(p => p.id !== projectId));
      } catch (error) {
          console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <div>
      {projectList.length === 0 ? (
        <div className='flex flex-col items-center justify-center mt-28 gap-5 p-5 border border-dashed rounded-xl py-16'>
          <Image src={'/logo.svg'} alt='logo' width={60} height={60} />
          <h2 className='text-gray-400 text-lg font-bold'>
            You don&apos;t have any projects yet. Create a new one!
          </h2>
          <div className="flex gap-4">
            <Button asChild variant="destructive" className="text-base font-semibold">
              <Link href="/create-new-video">+Create New Video</Link>
            </Button>
            <Button asChild variant="destructive" className="text-base font-semibold">
              <Link href="/create-new-image">+Create New Image</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
          {projectList.map((project) => {
            const isVideo = project.type === 'video';
            const linkUrl = isVideo ? `/play-video/${project.id}` : `/play-image/${project.id}`;
            const thumbnailUrl = isVideo ? project.images?.[0] : project.imageUrl;

            // Simplify: If all your content is 16:9, just set the displayAspectRatio directly.
            // This assumes project.aspectRatio from Firestore will be "16:9" for new items.
            // For old items without it, it will still default to 16/9.
            const displayAspectRatio = '16/9'; 
                                       
            return (
              <Link href={linkUrl} key={project.id}>
                <div className="border rounded-xl p-4 h-full flex flex-col justify-between relative group hover:shadow-lg transition">
                  <button 
                    onClick={(e) => handleDelete(e, project.id, project.type)}
                    className="absolute top-2 right-2 z-10 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="w-full rounded-xl overflow-hidden bg-slate-900" style={{ aspectRatio: displayAspectRatio }}>
                    {project.status === 'completed' || project.status === 'rendered' || project.status === 'assets_generated' ? (
                      <Image 
                        src={thumbnailUrl || '/logo.svg'} 
                        alt="Thumbnail" 
                        width={1920} // Enforce 16:9 landscape dimensions for Next.js Image
                        height={1080} // Enforce 16:9 landscape dimensions for Next.js Image
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className='w-full h-full flex flex-col items-center justify-center gap-2'>
                        <RefreshCcw className='animate-spin text-white' />
                        <h2 className='text-white text-center text-sm'>Generating...</h2>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {isVideo ? <Video size={16} /> : <ImageIcon size={16} />}
                    <h3 className="font-semibold truncate">{project.topic || 'Untitled'}</h3>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}
export default ProjectList;