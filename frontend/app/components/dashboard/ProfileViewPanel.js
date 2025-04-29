import React from 'react';

// Компонент для отображения rich text в панели информации
const RichTextDisplay = ({ content }) => {
  if (!content) return null;
  
  const paragraphs = content.split('\n').filter(line => line.trim() !== '');
  
  return (
    <div>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={`${paragraph.startsWith('• ') ? "ml-4" : ""} text-black`}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};

// Компонент для отображения панели информации профиля (режим просмотра)
const ProfileViewPanel = ({ formData, avatarPreview, onEdit }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-black">Профиль спикера</h1>
      </div>
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Аватар" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2 text-black">{formData.fullName}</h2>
          <p className="text-black mb-4">{formData.profession}</p>
          
          {formData.bio && (
            <div className="mb-4">
              <h3 className="font-medium text-black mb-1">О себе</h3>
              <RichTextDisplay content={formData.bio} />
            </div>
          )}
          
          {formData.speakingTopics && (
            <div className="mb-4">
              <h3 className="font-medium text-black mb-1">Темы выступлений</h3>
              <RichTextDisplay content={formData.speakingTopics} />
            </div>
          )}
          
          {formData.price && (
            <div className="mb-4">
              <h3 className="font-medium text-black mb-1">Стоимость</h3>
              <RichTextDisplay content={formData.price} />
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 mt-6">
            {formData.email && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-black">{formData.email}</span>
              </div>
            )}
            
            {formData.tel && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-black">{formData.tel}</span>
              </div>
            )}
            
            {formData.telegram && (
              <div className="flex items-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-black mr-2" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248c-.242 2.564-1.289 8.815-1.822 11.702-.225 1.215-.755 1.592-1.224 1.637-.928.078-1.676-.61-2.57-1.172-1.416-.882-2.218-1.43-3.601-2.29-.59-.371-2.081-1.36-.151-2.981 0 0 2.177-1.87 4.3-3.73.365-.321.752-1.043-.168-.547 0 0-2.955 1.87-5.511 3.33-.598.371-1.132.56-1.926.56-.802 0-2.338-.229-3.483-.56-.753-.214-1.346-.497-1.333-1.066.009-.396.397-.792 1.184-1.067 4.953-2.158 11.021-4.565 14.415-5.856.679-.26 2.182-.871 2.376-.88.171-.01.581.095.826.291.065.58.108.164.116.286.012.161.015.339.001.599z"/>
                </svg>
                <span className="text-black">{formData.telegram}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={onEdit}
        className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Редактировать профиль
      </button>
    </div>
  );
};

export default ProfileViewPanel;