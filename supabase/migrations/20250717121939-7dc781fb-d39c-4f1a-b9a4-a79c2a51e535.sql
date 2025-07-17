-- حذف نقش‌های تکراری برای کاربر
DELETE FROM user_roles 
WHERE id IN (
    SELECT id FROM user_roles 
    WHERE user_id = '9d548fd6-5880-4d4b-8414-2108df224146' 
    AND role = 'admin'
    ORDER BY created_at DESC 
    OFFSET 1
);